var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
	entry: {
		CrossTab: __dirname + '/src/index.js',
		CrossTabIframe: __dirname + '/src/iframe.js',
		CrossDomain: __dirname + '/src/CrossDomain.js'
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].js',
		libraryTarget: 'umd',
		library: '[name]',
		umdNamedDefine: true
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: [['es2015', {loose: true}], 'stage-0'],
				plugins: ['transform-es3-member-expression-literals', 'transform-es3-property-literals', 'transform-object-assign']
			}
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'iframe.html',
			template: __dirname + '/src/iframe.html',
			inlineSource: '.(js|css)$',
			inject: 'head',
			chunks: ['CrossTabIframe']
		}),
		new HtmlWebpackPlugin({
			filename: 'test.html',
			template: __dirname + '/src/index.html',
			inject: 'head',
			chunks: ['CrossTab']
		}),
		new HtmlWebpackPlugin({
			filename: 'crossDomain.html',
			template: __dirname + '/src/crossDomain.html',
			inject: 'head',
			chunks: ['CrossDomain']
		}),
		new HtmlWebpackInlineSourcePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	],
	devtool: '#sourcemap',
};
