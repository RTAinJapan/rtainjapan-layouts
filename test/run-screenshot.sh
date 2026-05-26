#!/usr/bin/env bash
# Boots a disposable NodeCG host with this repository wired in as a bundle,
# then runs the screenshot regression. Intended for both CI and local use.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOST_DIR="${NODECG_HOST_DIR:-${REPO_ROOT}/.nodecg-host}"
PORT="${NODECG_PORT:-9090}"

cleanup() {
	if [[ -n "${NCG_PID:-}" ]] && kill -0 "${NCG_PID}" 2>/dev/null; then
		kill "${NCG_PID}" 2>/dev/null || true
		wait "${NCG_PID}" 2>/dev/null || true
	fi
}
trap cleanup EXIT

# --- Set up NodeCG host (idempotent) -------------------------------------
if [[ ! -f "${HOST_DIR}/cli.mjs" ]]; then
	mkdir -p "${HOST_DIR}"
	(cd "${HOST_DIR}" && "${REPO_ROOT}/node_modules/.bin/nodecg" setup 2.6.4 --skip-dependencies)
	(cd "${HOST_DIR}" && npm install --no-audit --no-fund --ignore-scripts)
	(cd "${HOST_DIR}" && npm rebuild better-sqlite3)
fi

mkdir -p "${HOST_DIR}/bundles" "${HOST_DIR}/cfg" "${HOST_DIR}/db"

# Bundle link
BUNDLE_LINK="${HOST_DIR}/bundles/rtainjapan-layouts"
if [[ ! -L "${BUNDLE_LINK}" ]]; then
	rm -rf "${BUNDLE_LINK}"
	ln -s "${REPO_ROOT}" "${BUNDLE_LINK}"
fi

# NodeCG 2.6.4 ships templates under <root>/dist; the boot path expects them
# inside node_modules/nodecg/dist when NodeCG is installed as a dep. Mirror
# them so the dashboard view resolves and the client API is served.
mkdir -p "${HOST_DIR}/node_modules/nodecg/dist/server"
mkdir -p "${HOST_DIR}/node_modules/nodecg/dist/client"
ln -sfn "${HOST_DIR}/dist/server/templates" \
	"${HOST_DIR}/node_modules/nodecg/dist/server/templates"
for f in "${HOST_DIR}/dist/client/"*; do
	ln -sfn "$f" "${HOST_DIR}/node_modules/nodecg/dist/client/$(basename "$f")"
done

# --- Config --------------------------------------------------------------
cat >"${HOST_DIR}/cfg/nodecg.json" <<JSON
{
	"host": "127.0.0.1",
	"port": ${PORT},
	"baseURL": "127.0.0.1:${PORT}",
	"developer": false,
	"login": { "enabled": false },
	"logging": {
		"console": { "enabled": true, "level": "warn" },
		"file": { "enabled": false }
	},
	"sentry": { "enabled": false }
}
JSON

# Bundle config: extensions all guard against missing config and warn-then-skip,
# so an empty object is enough to satisfy bundle loading.
cat >"${HOST_DIR}/cfg/rtainjapan-layouts.json" <<'JSON'
{}
JSON

# --- Build bundle assets -------------------------------------------------
if [[ ! -d "${REPO_ROOT}/shared/dist" ]]; then
	(cd "${REPO_ROOT}" && npm run build)
fi

# --- Start NodeCG --------------------------------------------------------
LOG_FILE="${REPO_ROOT}/.nodecg-host.log"
(cd "${HOST_DIR}" && node cli.mjs start >"${LOG_FILE}" 2>&1) &
NCG_PID=$!

# Wait for the server to accept HTTP requests.
for i in $(seq 1 60); do
	if curl -sf -o /dev/null "http://127.0.0.1:${PORT}/bundles/rtainjapan-layouts/graphics/break.html"; then
		break
	fi
	if ! kill -0 "${NCG_PID}" 2>/dev/null; then
		echo "NodeCG exited unexpectedly. Log:" >&2
		tail -50 "${LOG_FILE}" >&2
		exit 1
	fi
	sleep 1
done

if ! curl -sf -o /dev/null "http://127.0.0.1:${PORT}/bundles/rtainjapan-layouts/graphics/break.html"; then
	echo "NodeCG did not become ready within 60s. Log:" >&2
	tail -80 "${LOG_FILE}" >&2
	exit 1
fi

# --- Capture --------------------------------------------------------------
(cd "${REPO_ROOT}" && BASE_URL="http://127.0.0.1:${PORT}" npm run screenshot)
