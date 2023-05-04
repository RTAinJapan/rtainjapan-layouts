import path from "path";
import fs from "fs";
import * as cheerio from "cheerio";
import {ResolvedConfig, Manifest, Plugin} from "vite";
import {globbySync} from "globby";
import {deleteSync} from "del";
import getPort, {portNumbers} from "get-port";

type PluginConfig = {
	bundleName: string;
	graphics?: string | string[];
	dashboard?: string | string[];
	template?: string | {graphics: string; dashboard: string};
};

export default ({
	bundleName,
	graphics = [],
	dashboard = [],
	template = "./src/template.html",
}: PluginConfig): Plugin => {
	let config: ResolvedConfig;
	let protocol: string;
	let host: string;
	let port: number;

	const graphicsInputs = globbySync(graphics);
	const dashboardInputs = globbySync(dashboard);
	const inputs = [...graphicsInputs, ...dashboardInputs];

	const generateHtmlFiles = async () => {
		const graphicsTemplate =
			typeof template === "string" ? template : template.graphics;
		const dashboardTemplate =
			typeof template === "string" ? template : template.dashboard;

		const graphicsTemplateHtml = fs.readFileSync(
			path.join(config.root, graphicsTemplate),
			"utf-8",
		);
		const dashboardTemplateHtml = fs.readFileSync(
			path.join(config.root, dashboardTemplate),
			"utf-8",
		);

		const graphicsOutdir = path.join(config.root, "graphics");
		const dashboardOutdir = path.join(config.root, "dashboard");

		deleteSync([`${graphicsOutdir}/**`, `${dashboardOutdir}/**`]);
		fs.mkdirSync(graphicsOutdir, {recursive: true});
		fs.mkdirSync(dashboardOutdir, {recursive: true});

		for (const input of inputs) {
			const templateHtml = graphicsInputs.includes(input)
				? graphicsTemplateHtml
				: dashboardTemplateHtml;
			const $ = cheerio.load(templateHtml);
			const head = $("head");

			if (config.mode === "development") {
				const address = `${protocol}://${host}:${port}`;
				head.append(`
					<script type="module">
						import RefreshRuntime from '${new URL(
							path.join(config.base, "@react-refresh"),
							address,
						)}'
						RefreshRuntime.injectIntoGlobalHook(window)
						window.$RefreshReg$ = () => {}
						window.$RefreshSig$ = () => (type) => type
						window.__vite_plugin_react_preamble_installed__ = true
					</script>
				`);
				head.append(
					`<script type="module" src="${new URL(
						path.join(config.base, "@vite/client"),
						address,
					)}"></script>`,
				);
				head.append(
					`<script type="module" src="${new URL(
						path.join(config.base, input),
						address,
					)}"></script>`,
				);
			}

			if (config.mode === "production") {
				const inputName = input.replace(/^\.\//, "");
				const manifest: Manifest = JSON.parse(
					fs.readFileSync(
						path.join(config.build.outDir, "manifest.json"),
						"utf-8",
					),
				);
				const entryChunk = manifest[inputName];

				if (entryChunk?.css) {
					for (const css of entryChunk.css) {
						head.append(
							`<link rel="stylesheet" href="${path.join(config.base, css)}">`,
						);
					}
				}

				if (entryChunk?.file) {
					head.append(
						`<script type="module" src="${path.join(
							config.base,
							entryChunk.file,
						)}"></script>`,
					);
				}
			}

			const newHtml = $.html();
			const dir = graphicsInputs.includes(input)
				? graphicsOutdir
				: dashboardOutdir;
			const name = path.basename(input, path.extname(input));
			fs.writeFileSync(path.join(dir, `${name}.html`), newHtml);
		}
	};

	return {
		name: "nodecg",

		config: async (baseConfig, {command}) => {
			protocol = baseConfig.server?.https ? "https" : "http";
			host =
				typeof baseConfig.server?.host === "string"
					? baseConfig.server.host
					: "localhost";
			port =
				baseConfig.server?.port ??
				(await getPort({port: portNumbers(3000, 4000)}));

			return {
				appType: "mpa",
				base:
					command === "serve"
						? `/bundles/${bundleName}`
						: `/bundles/${bundleName}/shared/dist`,
				server: {
					host,
					port,
					origin: `${protocol}://${host}:${port}`,
				},
				build: {
					rollupOptions: {
						input: inputs,
					},
					manifest: true,
					outDir: "./shared/dist",
					assetsDir: ".",
				},
			};
		},

		configResolved: (resolvedConfig) => {
			config = resolvedConfig;
		},

		buildStart: () => {
			if (config.command === "serve") {
				generateHtmlFiles();
			}
		},

		writeBundle: () => {
			if (config.command === "build") {
				generateHtmlFiles();
			}
		},
	};
};
