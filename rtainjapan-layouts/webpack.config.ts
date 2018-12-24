import {CheckerPlugin} from 'awesome-typescript-loader';
import CleanPlugin from 'clean-webpack-plugin';
import globby from 'globby';
import HtmlPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import webpack from 'webpack';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import nodeExternals from 'webpack-node-externals';

const isProduction = process.env.NODE_ENV === 'production';
const useAnalyzer = process.env.USE_ANALYZER === 'true';

const commonConfig: Partial<webpack.Configuration> = {
	mode: isProduction ? 'production' : 'development',
	devtool: isProduction ? 'source-map' : 'cheap-source-map',
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
	},
};

const makeBrowserConfig = (name: string): webpack.Configuration => {
	const entry: webpack.Entry = {};
	const files = globby.sync(`./src/${name}/views/*.tsx`);
	for (const file of files) {
		entry[path.basename(file, '.tsx')] = file;
	}

	return {
		...commonConfig,
		name,
		entry,
		output: {
			path: path.resolve(__dirname, name),
			filename: '[name].js',
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'awesome-typescript-loader',
					options: {
						useCache: true,
						configFileName: `./src/${name}/tsconfig.webpack.json`,
					},
				},
				{
					test: /\.(png|woff2?)$/,
					loader: 'file-loader',
					options: {
						name: '[name]__[hash].[ext]',
					},
				},
				{
					test: /\.s?css$/,
					loaders: [
						isProduction
							? MiniCssExtractPlugin.loader
							: 'style-loader',
						{
							loader: 'css-loader',
							options: {
								modules: true,
								localIdentName: '[local]__[hash:5]',
								sourceMap: true,
								camelCase: true,
								importLoaders: 1,
							},
						},
						'sass-loader',
					],
				},
			],
		},
		plugins: [
			new CleanPlugin([path.resolve(__dirname, name)]),
			new CheckerPlugin(),
			...Object.keys(entry).map(
				(entryName) =>
					new HtmlPlugin({
						filename: `${entryName}.html`,
						chunks: [entryName],
						title: entryName,
						template: `webpack/${name}.html`,
					}),
			),
			new MiniCssExtractPlugin({
				filename: '[name]-[hash].css',
				chunkFilename: '[id]-[hash].css',
			}),
			new BundleAnalyzerPlugin({
				analyzerMode:
					isProduction || !useAnalyzer ? 'disabled' : 'static',
			}),
		],
		optimization: {
			splitChunks: {
				chunks: 'all',
			},
		},
	};
};

const extensionConfig: webpack.Configuration = {
	...commonConfig,
	name: 'extension',
	target: 'node',
	node: false,
	entry: {
		index: './src/extension/index.ts',
	},
	output: {
		path: path.resolve(__dirname, 'extension'),
		filename: 'index.js',
		libraryTarget: 'commonjs2',
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'awesome-typescript-loader',
				options: {
					useCache: true,
					configFileName: './src/extension/tsconfig.webpack.json',
				},
			},
		],
	},
	externals: [nodeExternals()],
	plugins: [
		new CleanPlugin([path.resolve(__dirname, 'extension')]),
		new CheckerPlugin(),
	],
};

export default [
	makeBrowserConfig('dashboard'),
	makeBrowserConfig('graphics'),
	extensionConfig,
];
