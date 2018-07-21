const appRoot = require('app-root-path');
const Bundler = require('parcel-bundler');
const del = require('del');

const bundleFor = async ({input, output, target = 'browser'}) => {
	const entryFiles = appRoot.resolve(input);
	const outDir = appRoot.resolve(output);
	const options = {
		target,
		outDir,
		publicUrl: './',
	};

	await del(outDir);
	const bundler = new Bundler(entryFiles, options);
	await bundler.bundle();
};

const bundlers = [
	() =>
		bundleFor({
			input: 'src/extension/index.ts',
			output: 'extension',
			target: 'node',
		}),

	() =>
		bundleFor({
			input: 'src/dashboard/*.html',
			output: 'dashboard',
		}),

	() =>
		bundleFor({
			input: 'src/twitter-callback/*.html',
			output: 'twitter-callback',
		}),
];

if (process.env.NODE_ENV === 'production') {
	(async () => {
		for (const bundler of bundlers) {
			await bundler();
		}
	})();
} else {
	for (const bundler of bundlers) {
		bundler();
	}
}
