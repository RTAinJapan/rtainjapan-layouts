// スクリーンショット撮影スクリプト
//
// 開発時の手元実行と、CI実行の2種で実行可。
// 手元実行の場合は、nodecgが実行されていることを前提とし、CI実行の場合はこのスクリプトを通してnodecgを実行する。
//
// Modes:
//   default : Assume the developer has already started NodeCG (typically the
//             parent host at ../../ relative to this bundle) and just probe
//             BASE_URL before launching the screenshot capture.
//   --ci    : Boot a disposable NodeCG host under .nodecg-host/, link this
//             repository as a bundle, build, start NodeCG, wait until it
//             becomes ready, run the capture, and finally tear the host down.

import {
	spawn,
	spawnSync,
	type ChildProcess,
	type SpawnOptions,
	type SpawnSyncOptions,
} from "child_process";
import http from "http";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";

const REPO_ROOT = path.resolve(__dirname, "..");
const IS_WIN = process.platform === "win32";

const args = process.argv.slice(2);
const CI_MODE =
	args.includes("--ci") || process.env["RUN_SCREENSHOT_CI"] === "1";

const PORT = process.env["NODECG_PORT"] || "9090";
const BASE_URL = process.env["BASE_URL"] || `http://127.0.0.1:${PORT}`;
const HOST_DIR =
	process.env["NODECG_HOST_DIR"] || path.join(REPO_ROOT, ".nodecg-host");
const HOST_LOG = path.join(REPO_ROOT, ".nodecg-host.log");
const BUNDLE_NAME = "rtainjapan-layouts";
const PROBE_PATH = `/bundles/${BUNDLE_NAME}/graphics/break.html`;

const log = (...a: unknown[]): void => console.log("[screenshot]", ...a);
const sleep = (ms: number): Promise<void> =>
	new Promise((r) => setTimeout(r, ms));

// --- Process helpers -------------------------------------------------------
// On Windows, npm / nodecg / tsx are dispatched via .cmd shims which require
// `shell: true`. But passing an args array with shell:true concatenates tokens
// without quoting (and emits DEP0190), which breaks when the path contains
// spaces (e.g. "C:\\Users\\RTA in Japan\\..."). Build a single quoted command
// line and pass it as the command with no args when going through a shell.
// On Linux/macOS, spawn directly without shell.
function quoteArg(s: string): string {
	if (IS_WIN) {
		// cmd.exe-friendly: escape embedded quotes and wrap the whole token.
		return `"${s.replace(/"/g, '\\"')}"`;
	}
	// POSIX: single-quote and escape any embedded single quotes.
	return `'${s.replace(/'/g, "'\\''")}'`;
}

function buildShellCommandLine(cmd: string, cmdArgs: string[]): string {
	return [cmd, ...cmdArgs].map(quoteArg).join(" ");
}

function runSync(
	cmd: string,
	cmdArgs: string[],
	opts: SpawnSyncOptions = {},
): void {
	log("$", cmd, cmdArgs.join(" "));
	const result = IS_WIN
		? spawnSync(buildShellCommandLine(cmd, cmdArgs), [], {
				stdio: "inherit",
				shell: true,
				...opts,
		  })
		: spawnSync(cmd, cmdArgs, {stdio: "inherit", ...opts});
	if (result.error) throw result.error;
	if (result.status !== 0) {
		throw new Error(
			`${cmd} ${cmdArgs.join(" ")} exited with status ${result.status}`,
		);
	}
}

function localBin(name: string): string {
	const exe = IS_WIN ? `${name}.cmd` : name;
	return path.join(REPO_ROOT, "node_modules", ".bin", exe);
}

// --- HTTP probe ------------------------------------------------------------
function probeOnce(url: string): Promise<boolean> {
	return new Promise((resolve) => {
		const req = http.get(url, (res) => {
			res.resume();
			resolve(
				typeof res.statusCode === "number" &&
					res.statusCode >= 200 &&
					res.statusCode < 400,
			);
		});
		req.on("error", () => resolve(false));
		req.setTimeout(1500, () => {
			req.destroy();
			resolve(false);
		});
	});
}

// --- Filesystem helpers ----------------------------------------------------
async function ensureLink(target: string, linkPath: string): Promise<void> {
	// Remove anything at linkPath first so retries are idempotent.
	try {
		await fsp.rm(linkPath, {recursive: true, force: true});
	} catch {
		/* ignore */
	}
	let type: "file" | "junction" = "file";
	try {
		const st = await fsp.stat(target);
		type = st.isDirectory() ? "junction" : "file";
	} catch {
		/* target missing — let symlink fail loudly below */
	}
	try {
		await fsp.symlink(target, linkPath, type);
	} catch (e) {
		// Windows without developer mode / admin can't create symlinks; fall
		// back to copying. Junctions (used for directories) usually work even
		// without elevation, so this mostly affects per-file links.
		const msg = e instanceof Error ? e.message : String(e);
		log(`symlink failed for ${linkPath} (${msg}); falling back to copy`);
		await fsp.cp(target, linkPath, {recursive: true});
	}
}

// --- Bundle build ----------------------------------------------------------
function ensureBundleBuild(): void {
	const sharedDist = path.join(REPO_ROOT, "shared", "dist");
	if (!fs.existsSync(sharedDist)) {
		runSync("npm", ["run", "build"], {cwd: REPO_ROOT});
	}
}

// --- NodeCG host setup (CI mode) ------------------------------------------
async function ensureCiHost(): Promise<void> {
	const cliMjs = path.join(HOST_DIR, "cli.mjs");
	if (!fs.existsSync(cliMjs)) {
		await fsp.mkdir(HOST_DIR, {recursive: true});
		runSync(localBin("nodecg"), ["setup", "2.6.4", "--skip-dependencies"], {
			cwd: HOST_DIR,
		});
		runSync("npm", ["install", "--no-audit", "--no-fund", "--ignore-scripts"], {
			cwd: HOST_DIR,
		});
		runSync("npm", ["rebuild", "better-sqlite3"], {cwd: HOST_DIR});
	}

	await fsp.mkdir(path.join(HOST_DIR, "bundles"), {recursive: true});
	await fsp.mkdir(path.join(HOST_DIR, "cfg"), {recursive: true});
	await fsp.mkdir(path.join(HOST_DIR, "db"), {recursive: true});

	// Register this repo as a bundle.
	await ensureLink(REPO_ROOT, path.join(HOST_DIR, "bundles", BUNDLE_NAME));

	// NodeCG 2.6.4 ships templates under <root>/dist/{server,client}; mirror
	// them into node_modules/nodecg/dist so the dashboard view resolves when
	// NodeCG runs as a dependency.
	const distSrvTemplates = path.join(HOST_DIR, "dist", "server", "templates");
	const distCli = path.join(HOST_DIR, "dist", "client");
	const nmServer = path.join(
		HOST_DIR,
		"node_modules",
		"nodecg",
		"dist",
		"server",
	);
	const nmClient = path.join(
		HOST_DIR,
		"node_modules",
		"nodecg",
		"dist",
		"client",
	);
	await fsp.mkdir(nmServer, {recursive: true});
	await fsp.mkdir(nmClient, {recursive: true});

	await ensureLink(distSrvTemplates, path.join(nmServer, "templates"));

	if (fs.existsSync(distCli)) {
		for (const entry of await fsp.readdir(distCli, {withFileTypes: true})) {
			await ensureLink(
				path.join(distCli, entry.name),
				path.join(nmClient, entry.name),
			);
		}
	}

	// Write minimal config (login disabled, file logging off).
	const nodecgCfg = {
		host: "127.0.0.1",
		port: Number(PORT),
		baseURL: `127.0.0.1:${PORT}`,
		developer: false,
		login: {enabled: false},
		logging: {
			console: {enabled: true, level: "warn"},
			file: {enabled: false},
		},
		sentry: {enabled: false},
	};
	await fsp.writeFile(
		path.join(HOST_DIR, "cfg", "nodecg.json"),
		JSON.stringify(nodecgCfg, null, "\t") + "\n",
	);
	// Each bundle extension guards against missing config and warns-then-skips,
	// so an empty object is enough to satisfy bundle loading.
	await fsp.writeFile(
		path.join(HOST_DIR, "cfg", `${BUNDLE_NAME}.json`),
		"{}\n",
	);
}

// --- NodeCG lifecycle (CI mode) -------------------------------------------
let ncgChild: ChildProcess | null = null;
let ncgExited = false;
let cleaning = false;

async function startNodeCg(): Promise<void> {
	log(`starting NodeCG host (logs -> ${HOST_LOG})`);
	const out = fs.openSync(HOST_LOG, "w");
	const err = fs.openSync(HOST_LOG, "a");
	ncgChild = spawn(process.execPath, ["cli.mjs", "start"], {
		cwd: HOST_DIR,
		stdio: ["ignore", out, err],
		detached: false,
	});
	ncgChild.on("exit", (code, sig) => {
		ncgExited = true;
		log(`NodeCG host exited (code=${code} sig=${sig})`);
		ncgChild = null;
	});

	const probeUrl = `${BASE_URL}${PROBE_PATH}`;
	const deadline = Date.now() + 60_000;
	while (Date.now() < deadline) {
		if (ncgExited) {
			dumpHostLog();
			throw new Error("NodeCG exited before becoming ready");
		}
		if (await probeOnce(probeUrl)) return;
		await sleep(1000);
	}
	dumpHostLog();
	throw new Error(`NodeCG did not become ready within 60s (${probeUrl})`);
}

function dumpHostLog(): void {
	try {
		const text = fs.readFileSync(HOST_LOG, "utf8");
		const tail = text.split("\n").slice(-80).join("\n");
		console.error("NodeCG host log (last 80 lines):\n" + tail);
	} catch {
		/* ignore */
	}
}

function stopNodeCg(): void {
	if (cleaning) return;
	cleaning = true;
	if (!ncgChild || ncgChild.pid == null) return;
	try {
		if (IS_WIN) {
			spawnSync("taskkill", ["/pid", String(ncgChild.pid), "/T", "/F"], {
				stdio: "ignore",
			});
		} else {
			ncgChild.kill("SIGTERM");
		}
	} catch {
		/* ignore */
	}
}

// --- Capture ---------------------------------------------------------------
async function runCapture(): Promise<void> {
	log("running capture against", BASE_URL);
	const tsx = localBin("tsx");
	const script = path.join(__dirname, "screenshot-graphics.ts");
	const baseOpts: SpawnOptions = {
		cwd: REPO_ROOT,
		stdio: "inherit",
		env: {...process.env, BASE_URL},
	};
	await new Promise<void>((resolve, reject) => {
		const child = IS_WIN
			? spawn(buildShellCommandLine(tsx, [script]), [], {
					...baseOpts,
					shell: true,
			  })
			: spawn(tsx, [script], baseOpts);
		child.on("error", reject);
		child.on("exit", (code) =>
			code === 0
				? resolve()
				: reject(new Error(`screenshot capture exited with status ${code}`)),
		);
	});
}

// --- Main ------------------------------------------------------------------
async function main(): Promise<void> {
	if (CI_MODE) {
		log("CI mode: setting up a disposable NodeCG host");
		ensureBundleBuild();
		await ensureCiHost();
		await startNodeCg();
	} else {
		log(`dev mode: expecting NodeCG to already be running at ${BASE_URL}`);
		const reachable = await probeOnce(`${BASE_URL}${PROBE_PATH}`);
		if (!reachable) {
			console.error(
				[
					``,
					`NodeCG bundle '${BUNDLE_NAME}' is not reachable at ${BASE_URL}.`,
					``,
					`Expected: the parent NodeCG host (../../) is running and serves`,
					`  this repository as the '${BUNDLE_NAME}' bundle (e.g. run`,
					`  'npm start' or 'nodecg start' from the host directory).`,
					``,
					`Override BASE_URL or NODECG_PORT to point at a different host,`,
					`or pass --ci to boot a disposable host under .nodecg-host/.`,
					``,
				].join("\n"),
			);
			process.exit(1);
		}
	}

	try {
		await runCapture();
	} finally {
		if (CI_MODE) stopNodeCg();
	}
}

for (const sig of ["SIGINT", "SIGTERM"] as const) {
	process.on(sig, () => {
		stopNodeCg();
		process.exit(1);
	});
}
process.on("exit", () => stopNodeCg());

main().catch((e: unknown) => {
	const msg = e instanceof Error ? e.message : String(e);
	console.error("Fatal:", msg);
	stopNodeCg();
	process.exit(1);
});
