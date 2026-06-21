import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const sdPlugin = "jp.rtainjapan.layouts.sdPlugin";

/**
 * Stream Deck runs the plugin with its own bundled Node.js. We bundle the whole
 * plugin (including `@elgato/streamdeck` and `socket.io-client`) into a single
 * CommonJS file so the `.sdPlugin` folder is self-contained and needs no
 * `node_modules` shipped alongside it.
 *
 * @type {import("rollup").RollupOptions}
 */
const config = {
	input: "src/plugin.ts",
	output: {
		file: `${sdPlugin}/bin/plugin.cjs`,
		format: "cjs",
		sourcemap: true,
	},
	// Optional native acceleration for `ws`; absent at runtime, `ws` falls back
	// to its pure-JS implementation, so leave them as runtime requires.
	external: ["bufferutil", "utf-8-validate"],
	plugins: [
		typescript({tsconfig: "./tsconfig.json"}),
		nodeResolve({
			browser: false,
			exportConditions: ["node"],
			preferBuiltins: true,
			extensions: [".ts", ".mjs", ".js", ".json", ".node"],
		}),
		commonjs(),
		json(),
	],
	onwarn(warning, warn) {
		// socket.io / engine.io ship code that trips these benign warnings.
		if (
			warning.code === "CIRCULAR_DEPENDENCY" ||
			warning.code === "THIS_IS_UNDEFINED"
		) {
			return;
		}
		warn(warning);
	},
};

export default config;
