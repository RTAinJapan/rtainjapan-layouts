import path from "path";
import fs from "fs/promises";
import {ResolvedConfig, Manifest, ManifestChunk, Plugin} from "vite";
import {globbySync} from "globby";
import {
	rollup,
	watch as rollupWatch,
	type RollupOptions,
	type InputOptions,
	type OutputOptions,
	type RollupWatchOptions,
	type RollupWatcherEvent,
	type RollupWatcher,
} from "rollup";

const setupExtensionBuild = async (options: RollupOptions) => {
	const inputOptions: InputOptions = {
		...options,
	};

	const outputOptions: OutputOptions = {
		dir: "./extension",
		format: "cjs",
		sourcemap: true,
		interop: "auto",
		...options.output,
	};

	const watchOptions: RollupWatchOptions = {
		...options,
		watch: {
			clearScreen: false,
			...options.watch,
		},
		output: {
			dir: "./extension",
			format: "cjs",
			sourcemap: true,
			interop: "auto",
			...options.output,
		},
	};

	let watcher: RollupWatcher;
	const watchEventHandler = (event: RollupWatcherEvent) => {
		if (event.code === "BUNDLE_END" || event.code === "ERROR") {
			event.result?.close();
		}
	};

	return {
		watch: () => {
			watcher = rollupWatch(watchOptions);
			watcher.on("event", watchEventHandler);
		},
		unwatch: () => {
			watcher.off("event", watchEventHandler);
			watcher.close();
		},
		build: async () => {
			const bundle = await rollup(inputOptions);
			await bundle.write(outputOptions);
			await bundle.close();
		},
	};
};

type PluginConfig = {
	bundleName: string;
	graphics?: string | string[];
	dashboard?: string | string[];
	extension?: string | RollupOptions;
	template?: string | {graphics: string; dashboard: string};
	server?: {
		host?: string;
		port?: number;
	};
};

export default async ({
	bundleName,
	graphics = [],
	dashboard = [],
	extension,
	template = "./src/template.html",
	server,
}: PluginConfig): Promise<Plugin> => {
	let config: ResolvedConfig;
	let origin: string;

	const extensionRollup =
		typeof extension === "string"
			? await setupExtensionBuild({input: extension})
			: typeof extension === "object"
			? await setupExtensionBuild(extension)
			: extension;

	const graphicsInputs = globbySync(graphics);
	const dashboardInputs = globbySync(dashboard);

	const generateHtmlFiles = async () => {
		const [graphicsTemplateHtml, dashboardTemplateHtml] = await Promise.all([
			fs.readFile(
				path.join(
					config.root,
					typeof template === "string" ? template : template.graphics,
				),
				"utf-8",
			),
			fs.readFile(
				path.join(
					config.root,
					typeof template === "string" ? template : template.dashboard,
				),
				"utf-8",
			),
		]);

		const graphicsOutdir = path.join(config.root, "graphics");
		const dashboardOutdir = path.join(config.root, "dashboard");

		await Promise.all([
			fs.rm(graphicsOutdir, {recursive: true, force: true}),
			fs.rm(dashboardOutdir, {recursive: true, force: true}),
		]);
		await Promise.all([
			fs.mkdir(graphicsOutdir, {recursive: true}),
			fs.mkdir(dashboardOutdir, {recursive: true}),
		]);

		const manifest =
			config.command === "build"
				? (JSON.parse(
						await fs.readFile(
							path.join(config.build.outDir, "manifest.json"),
							"utf-8",
						),
				  ) as Manifest)
				: undefined;

		const generateHtml = async (
			input: string,
			templateHtml: string,
			outputDir: string,
		) => {
			const head: string[] = [];

			if (config.command === "serve") {
				head.push(`
					<script type="module">
						import RefreshRuntime from '${new URL(
							path.join(config.base, "@react-refresh"),
							origin,
						)}'
						RefreshRuntime.injectIntoGlobalHook(window)
						window.$RefreshReg$ = () => {}
						window.$RefreshSig$ = () => (type) => type
						window.__vite_plugin_react_preamble_installed__ = true
					</script>
				`);
				head.push(
					`<script type="module" src="${new URL(
						path.join(config.base, "@vite/client"),
						origin,
					)}"></script>`,
				);
				head.push(
					`<script type="module" src="${new URL(
						path.join(config.base, input),
						origin,
					)}"></script>`,
				);
			}

			if (config.command === "build") {
				const inputName = input.replace(/^\.\//, "");
				const entryChunk = manifest?.[inputName];

				const checkCss = (chunk: ManifestChunk) => {
					if (chunk.css) {
						for (const css of chunk.css) {
							head.push(
								`<link rel="stylesheet" href="${path.join(config.base, css)}">`,
							);
						}
					}
					if (chunk.imports) {
						for (const importName of chunk.imports) {
							const childChunk = manifest?.[importName];
							if (childChunk) {
								checkCss(childChunk);
							}
						}
					}
				};

				if (entryChunk) {
					checkCss(entryChunk);
				}

				if (entryChunk?.file) {
					head.push(
						`<script type="module" src="${path.join(
							config.base,
							entryChunk.file,
						)}"></script>`,
					);
				}
			}

			const newHtml = templateHtml.includes("</head>")
				? templateHtml.replace("</head>", `${head.join("\n")}\n</head>`)
				: `${head.join("\n")}\n${templateHtml}`;
			const name = path.basename(input, path.extname(input));
			await fs.writeFile(path.join(outputDir, `${name}.html`), newHtml);
		};

		await Promise.all([
			...graphicsInputs.map((input) =>
				generateHtml(input, graphicsTemplateHtml, graphicsOutdir),
			),
			...dashboardInputs.map((input) =>
				generateHtml(input, dashboardTemplateHtml, dashboardOutdir),
			),
		]);
	};

	return {
		name: "nodecg",

		config: async (_, {command}) => {
			const host = server?.host ?? "localhost";
			const port = server?.port ?? 8080;
			origin = `http://${host}:${port}`;
			return {
				appType: "mpa",
				base:
					command === "serve"
						? `/bundles/${bundleName}`
						: `/bundles/${bundleName}/shared/dist`,
				server: {host, port, origin},
				build: {
					rollupOptions: {
						input: [...graphicsInputs, ...dashboardInputs],
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

		buildStart: async () => {
			if (config.command === "serve") {
				void generateHtmlFiles();
				extensionRollup?.watch();
			}
		},

		writeBundle: async () => {
			if (config.command === "build") {
				await Promise.all([generateHtmlFiles(), extensionRollup?.build()]);
			}
		},

		buildEnd: () => {
			if (config.command === "serve") {
				extensionRollup?.unwatch();
			}
		},
	};
};
