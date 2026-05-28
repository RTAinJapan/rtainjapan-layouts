// screenshot harness.
//
// Assumes NodeCG is already running at BASE_URL with this bundle installed.
//   1. Seed replicants via a graphics URL (graphics pages embed the full NodeCG client).
//   2. Screenshot every graphics URL. game.html is shot once per layout in
//      both "start" (timer Running) and "finished" (timer Finished + results
//      populated) states so the regression covers the pre-run and post-run
//      display for every game-scene layout.
//   3. Screenshot every dashboard panel by locating its iframe in the dashboard root.
//   4. Re-seed commentator-count variations and re-shoot representative
//      game-scene layouts (0 / 1 commentator).
// PNGs are written under test/screenshots/.

import puppeteer, {Page} from "puppeteer";
import path from "path";
import fs from "fs";
import {setTimeout as sleep} from "timers/promises";

import {
	fixtures,
	dashboardPanels,
	graphics,
	commentatorVariations,
	commentatorVariationLayouts,
	gameSceneStates,
	startTimer,
} from "./fixtures/sample-data";

const BASE_URL = process.env["BASE_URL"] || "http://127.0.0.1:9090";
const BUNDLE = "rtainjapan-layouts";
const SCREENSHOT_DIR = path.join(__dirname, "screenshots");
const GAME_SCENE_DIR = path.join(
	__dirname,
	"..",
	"src/browser/graphics/views/game-scene",
);

const gameSceneVariations = fs
	.readdirSync(GAME_SCENE_DIR)
	.filter((f) => f.endsWith(".tsx") && f !== "background.tsx")
	.map((f) => `?layout=${path.basename(f, ".tsx")}`);

graphics.forEach((g) => {
	if (g.file === "game.html") {
		g.variations = gameSceneVariations;
	}
});

const ensureDir = (p: string) => {
	if (!fs.existsSync(p)) fs.mkdirSync(p, {recursive: true});
};
ensureDir(SCREENSHOT_DIR);
ensureDir(path.join(SCREENSHOT_DIR, "dashboard"));
ensureDir(path.join(SCREENSHOT_DIR, "graphics"));
ensureDir(path.join(SCREENSHOT_DIR, "variations"));

// Seed routine source, injected as a string to avoid tsx helper symbols
// (`__name` etc.) leaking into the browser context.
const SEED_FN_SRC = `
		(function(data){
			var ncg = window.nodecg;
			var entries = Object.keys(data).map(function(k){ return [k, data[k]]; });
			function setIt(rep, value){
				try { rep.value = value; return "set"; }
				catch (e) { return "error:" + (e && e.message); }
			}
			return Promise.all(entries.map(function(entry){
				return new Promise(function(resolve){
					var name = entry[0], value = entry[1];
					var rep = ncg.Replicant(name);
					if (rep.status === "declared") {
						resolve({name: name, status: setIt(rep, value)});
						return;
					}
					var done = false;
					var finish = function(status){
						if (done) return;
						done = true;
						resolve({name: name, status: status});
					};
					var t = setTimeout(function(){ finish("timeout"); }, 8000);
					rep.on("declared", function(){
						clearTimeout(t);
						finish(setIt(rep, value));
					});
				});
			})).then(function(results){
				return new Promise(function(r){ setTimeout(function(){ r(results); }, 1500); });
			});
		})
	`;

const seedReplicants = async (
	page: Page,
	data: Record<string, unknown>,
	{ensureNodecg}: {ensureNodecg: boolean} = {ensureNodecg: false},
) => {
	if (ensureNodecg) {
		const seedUrl = `${BASE_URL}/bundles/${BUNDLE}/graphics/break.html`;
		await page.goto(seedUrl, {
			waitUntil: "domcontentloaded",
			timeout: 30000,
		});
		await page.waitForFunction(
			() => typeof (window as {nodecg?: unknown}).nodecg !== "undefined",
			{timeout: 15000},
		);
	}
	const seedReport: {name: string; status: string}[] = await page.evaluate(
		`(${SEED_FN_SRC})(${JSON.stringify(data)})`,
	);
	for (const r of seedReport) {
		if (r.status !== "set") {
			console.warn(`  seed ${r.name}: ${r.status}`);
		}
	}
};

// Re-open break.html so we have a fresh NodeCG client, then re-seed the given
// replicants. Used between variation shots so the new replicant values are
// applied before opening the target graphics URL.
const reseed = async (page: Page, data: Record<string, unknown>) => {
	await page.goto(`${BASE_URL}/bundles/${BUNDLE}/graphics/break.html`, {
		waitUntil: "domcontentloaded",
		timeout: 30000,
	});
	await page.waitForFunction(
		() => typeof (window as {nodecg?: unknown}).nodecg !== "undefined",
		{timeout: 15000},
	);
	await seedReplicants(page, data);
};

const shootUrl = async (
	page: Page,
	url: string,
	outputPath: string,
	width: number,
	height: number,
) => {
	await page.setViewport({width, height});
	await page.goto(url, {waitUntil: "domcontentloaded", timeout: 20000});
	await page.evaluate(() => {
		document.body.style.backgroundColor = "#003a3a";
	});
	// Give React + replicant subscriptions time to render.
	await sleep(2500);
	await page.screenshot({path: outputPath, fullPage: false});
	console.log(`saved ${path.relative(process.cwd(), outputPath)}`);
};

// NodeCG 2 dashboard renders bundle panels as <ncg-dashboard-panel> elements
// nested inside the <ncg-dashboard> web component shadow DOM. We resolve the
// panel by id (bundle_panelName), then screenshot its viewport-relative box.
const shootDashboardPanel = async (
	page: Page,
	panelId: string,
	outputPath: string,
) => {
	const rectFnSrc = `
		(function(id){
			function find(root, depth){
				if (depth > 6) return null;
				var el = root.querySelector('ncg-dashboard-panel#' + id);
				if (el) return el;
				var nodes = root.querySelectorAll('*');
				for (var i = 0; i < nodes.length; i++) {
					if (nodes[i].shadowRoot) {
						var r = find(nodes[i].shadowRoot, depth + 1);
						if (r) return r;
					}
				}
				return null;
			}
			var panel = find(document, 0);
			if (!panel) return null;
			panel.scrollIntoView({block: "center"});
			var r = panel.getBoundingClientRect();
			return {x: r.x, y: r.y, width: r.width, height: r.height};
		})
	`;
	const rect = (await page.evaluate(
		`(${rectFnSrc})(${JSON.stringify(panelId)})`,
	)) as {x: number; y: number; width: number; height: number} | null;
	if (!rect) {
		throw new Error(`panel not found: ${panelId}`);
	}
	if (rect.width <= 0 || rect.height <= 0) {
		throw new Error(`panel has zero size: ${panelId}`);
	}
	await sleep(400);
	await page.screenshot({
		path: outputPath,
		clip: {
			x: Math.max(0, Math.floor(rect.x)),
			y: Math.max(0, Math.floor(rect.y)),
			width: Math.ceil(rect.width),
			height: Math.ceil(rect.height),
		},
	});
	console.log(`saved ${path.relative(process.cwd(), outputPath)}`);
};

async function main() {
	const browser = await puppeteer.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
		timeout: 100000,
	});
	const page = await browser.newPage();
	page.on("pageerror", (err) => console.warn(`pageerror: ${err.message}`));

	console.log("seeding replicants...");
	await seedReplicants(page, fixtures, {ensureNodecg: true});

	const failures: string[] = [];

	// Graphics. For game.html, shoot every layout once per timer state
	// (start / finished) so the regression covers both the pre-run and post-run
	// display of every game-scene layout. Other graphics files are timer-state
	// agnostic and are shot once.
	for (const g of graphics) {
		const base = path.basename(g.file, ".html");
		const variations =
			g.variations && g.variations.length > 0 ? g.variations : [""];

		if (g.file === "game.html") {
			for (const state of gameSceneStates) {
				console.log(`seeding game-scene state: ${state.label}`);
				await reseed(page, {timer: state.timer});
				for (const v of variations) {
					const tag = v ? v.replace(/[?&=]/g, "-") : "default";
					const url = `${BASE_URL}/bundles/${BUNDLE}/graphics/${g.file}${v}`;
					const out = path.join(
						SCREENSHOT_DIR,
						"graphics",
						`${base}-${tag}-${state.label}.png`,
					);
					try {
						await shootUrl(page, url, out, g.width, g.height);
					} catch (e) {
						failures.push(
							`graphics/${g.file}${v} (${state.label}): ${
								(e as Error).message
							}`,
						);
					}
				}
			}
			// Reset timer back to start so subsequent (non-game) shots & variation
			// loops start from a known baseline.
			await reseed(page, {timer: startTimer});
		} else {
			for (const v of variations) {
				const tag = v ? v.replace(/[?&=]/g, "-") : "default";
				const url = `${BASE_URL}/bundles/${BUNDLE}/graphics/${g.file}${v}`;
				const out = path.join(SCREENSHOT_DIR, "graphics", `${base}-${tag}.png`);
				try {
					await shootUrl(page, url, out, g.width, g.height);
				} catch (e) {
					failures.push(`graphics/${g.file}${v}: ${(e as Error).message}`);
				}
			}
		}
	}

	// Dashboard: load the dashboard root once and capture each panel's iframe.
	try {
		await page.setViewport({width: 1920, height: 1080});
		await page.goto(`${BASE_URL}/dashboard/`, {
			waitUntil: "domcontentloaded",
			timeout: 20000,
		});
		// Wait for the dashboard web components to register and panels to mount.
		await sleep(5000);
		let lastHash = "";
		for (const panel of dashboardPanels) {
			if (panel.hash !== lastHash) {
				await page.evaluate((h) => {
					location.hash = `#${h}`;
				}, panel.hash);
				await sleep(1500);
				lastHash = panel.hash;
			}
			const out = path.join(SCREENSHOT_DIR, "dashboard", `${panel.name}.png`);
			const id = `${BUNDLE}_${panel.id}`;
			try {
				await shootDashboardPanel(page, id, out);
			} catch (e) {
				failures.push(`dashboard/${panel.name}: ${(e as Error).message}`);
			}
		}
	} catch (e) {
		failures.push(`dashboard root: ${(e as Error).message}`);
	}

	// Commentator-count variations. The default capture above used 2 commentators;
	// here we re-seed current-run with 0 and 1 commentator versions and re-shoot
	// representative game-scene layouts so the regression covers all 3 patterns.
	const baseRun = fixtures["current-run"] as Record<string, unknown>;
	for (const variation of commentatorVariations) {
		console.log(`seeding commentator variation: ${variation.label}`);
		const variantRun = {...baseRun, commentators: variation.commentators};
		await reseed(page, {"current-run": variantRun});
		for (const layout of commentatorVariationLayouts) {
			const url = `${BASE_URL}/bundles/${BUNDLE}/graphics/game.html?layout=${layout}`;
			const out = path.join(
				SCREENSHOT_DIR,
				"variations",
				`game-${layout}-${variation.label}.png`,
			);
			try {
				await shootUrl(page, url, out, 1920, 1030);
			} catch (e) {
				failures.push(
					`variations/${layout}/${variation.label}: ${(e as Error).message}`,
				);
			}
		}
	}

	await browser.close();

	if (failures.length > 0) {
		console.error(`\n${failures.length} screenshot(s) failed:`);
		failures.forEach((f) => console.error(`  - ${f}`));
		process.exit(1);
	}
	console.log("All screenshots completed.");
}

main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
