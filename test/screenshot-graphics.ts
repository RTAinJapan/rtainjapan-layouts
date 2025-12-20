import puppeteer, {Page} from "puppeteer";
import path from "path";
import fs from "fs";
import {setTimeout} from "timers/promises";

// Configuration
const BASE_URL = process.env["BASE_URL"] || "http://localhost:9090";
const SCREENSHOT_DIR = path.join(__dirname, "screenshots");
const GAME_SCENE_DIR = path.join(
	__dirname,
	"..",
	"src/browser/graphics/views/game-scene",
);

// Dynamically load all game scene layouts from graphics/views/game-scene
const scene = fs
	.readdirSync(GAME_SCENE_DIR)
	.filter((file) => file.endsWith(".tsx") && file !== "background.tsx")
	.map((file) => path.basename(file, ".tsx"));

// Define your graphics pages and query variations
const pages: Array<{
	file: string;
	width: number;
	height: number;
	variations?: string[];
}> = [
	{
		file: "break.html",
		width: 1920,
		height: 1030,
	},
	{
		file: "game.html",
		width: 1920,
		height: 1030,
		variations: scene.map((layout) => `?layout=${layout}`),
	},
];

// Create screenshot directory if it doesn't exist
if (!fs.existsSync(SCREENSHOT_DIR)) {
	fs.mkdirSync(SCREENSHOT_DIR, {recursive: true});
}

async function takeScreenshot(
	page: Page,
	url: string,
	outputPath: string,
	width: number,
	height: number,
	retries = 3,
): Promise<void> {
	console.log(`Taking screenshot: ${outputPath}`);

	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			await page.setViewport({width, height});
			await page.goto(url, {waitUntil: "networkidle2", timeout: 30000});

			// Set green background
			await page.evaluate(() => {
				document.body.style.backgroundColor = "green";
			});

			// Wait a bit for animations to settle
			await setTimeout(2000);

			await page.screenshot({
				path: outputPath,
				fullPage: false,
			});

			console.log(`Saved: ${outputPath}`);
			return; // Success, exit the function
		} catch (error) {
			if (attempt < retries) {
				console.warn(
					`Attempt ${attempt} failed for ${outputPath}, retrying... (${error})`,
				);
				await setTimeout(1000); // Wait 1 second before retrying
			} else {
				console.error(
					`Failed to screenshot ${outputPath} after ${retries} attempts`,
				);
				throw error; // Re-throw on final attempt
			}
		}
	}
}

async function main() {
	console.log("Starting screenshot capture...");

	const browser = await puppeteer.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
		timeout: 100000,
	});

	const page = await browser.newPage();

	for (const pageConfig of pages) {
		const baseName = path.basename(pageConfig.file, ".html");
		const variations = pageConfig.variations || [""];

		for (const variation of variations) {
			const url = `${BASE_URL}/bundles/rtainjapan-layouts/graphics/${pageConfig.file}${variation}`;
			const variationName = variation
				? variation.replace(/[?&=]/g, "-")
				: "default";
			const fileName = `${baseName}-${variationName}.png`;
			const outputPath = path.join(SCREENSHOT_DIR, fileName);

			try {
				await takeScreenshot(
					page,
					url,
					outputPath,
					pageConfig.width,
					pageConfig.height,
				);
			} catch (error) {
				console.error(`Failed to screenshot ${url}:`, error);
			}
		}
	}

	await browser.close();
	console.log("All screenshots completed!");
}

main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
