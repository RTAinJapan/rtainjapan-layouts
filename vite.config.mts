import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import nodecg from "./vite-plugin-nodecg.mjs";
import rollupEsbuild from "rollup-plugin-esbuild";
import rollupExternals from "rollup-plugin-node-externals";

export default defineConfig({
	clearScreen: false,
	plugins: [
		react(),
		nodecg({
			bundleName: "rtainjapan-layouts",
			graphics: "./src/browser/graphics/views/*.tsx",
			dashboard: "./src/browser/dashboard/views/*.tsx",
			extension: {
				input: "./src/extension/index.ts",
				plugins: [rollupEsbuild(), rollupExternals()],
			},
		}),
	],
});
