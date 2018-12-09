import {CheckerPlugin} from 'awesome-typescript-loader';
import CleanPlugin from 'clean-webpack-plugin';
import globby from 'globby';
import HtmlPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';

const isProduction = process.env.NODE_ENV === 'production';

const baseConfig: Partial<webpack.Configuration> = {
	mode: isProduction ? 'production' : 'development',
	devtool: 'cheap-source-map',
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
	},
};

const makeBrowserConfig = (name: string): webpack.Configuration => {
	const entry: webpack.Entry = {};
	for (const file of globby.sync(`./src/${name}/views/*.tsx`)) {
		entry[path.basename(file, '.tsx')] = file;
	}

	return {
		...baseConfig,
		name,
		entry,
		output: {path: path.resolve(__dirname, name), filename: '[name].js'},
		module: {
			rules: [
				{test: /\.tsx?$/, loader: 'awesome-typescript-loader'},
				{test: /\.png$/, loader: 'file-loader'},
			],
		},
		plugins: [
			new CleanPlugin([name]),
			...Object.keys(entry).map(
				entryName =>
					new HtmlPlugin({
						filename: `${entryName}.html`,
						chunks: [entryName],
						title: entryName,
						template: 'webpack/template.html',
					})
			),
			new CheckerPlugin(),
			new BundleAnalyzerPlugin({
				analyzerMode: isProduction ? 'disabled' : 'static',
			}),
		],
		optimization: {
			splitChunks: {
				chunks: 'all',
				minSize: 0,
			},
		},
	};
};

const extensionConfig: webpack.Configuration = {
	...baseConfig,
	name: 'extension',
	target: 'node',
	entry: {
		index: './src/extension/index.ts',
	},
	output: {
		path: path.resolve(__dirname, 'extension'),
		filename: 'index.js',
	},
	module: {
		rules: [{test: /\.ts$/, loader: 'awesome-typescript-loader'}],
	},
	plugins: [new CleanPlugin(['extension'])],
};

export default [
	makeBrowserConfig('dashboard'),
	makeBrowserConfig('graphics'),
	extensionConfig,
];
