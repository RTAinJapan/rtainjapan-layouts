const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: __dirname,

	mode: 'development',

	entry: './index.tsx',

	output: {
		path: path.resolve(__dirname, '../../dashboard'),
		filename: 'bundle.js',
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader',
				options: {
					configFileName: './tsconfig.dashboard.json',
				},
			},
			{
				test: /\.scss$/,
				use: [
					{loader: 'style-loader'},
					{loader: 'css-loader'},
					{loader: 'sass-loader'},
				],
			},
			{enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'},
		],
	},

	devtool: 'source-map',

	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json'],
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: './tech.html',
			filename: 'tech.html',
		}),
	],
};
