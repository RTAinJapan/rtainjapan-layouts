import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import nodecg from "./vite-plugin-nodecg.mjs";

export default defineConfig({
	plugins: [
		react(),
		nodecg({
			bundleName: "rtainjapan-layouts",
			graphics: "./src/browser/graphics/views/*.tsx",
			dashboard: "./src/browser/dashboard/views/*.tsx",
		}),
	],
});
