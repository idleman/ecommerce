const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const extractLess = new ExtractTextPlugin({ filename: '[name].[contenthash].css' });

const nodeEnv = process.env.NODE_ENV ? 'production' : 'development';

const plugins = [
  //new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', minChunks: Infinity, filename: 'vendor.bundle.js' }),
  new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify(nodeEnv) } }),
  new webpack.NamedModulesPlugin(),
  new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
  new UglifyJsPlugin({ sourceMap: true }),
  extractLess
];

module.exports = {
  devtool: 'source-map',
  entry: './client.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "less-loader", options: { strictMath: true, noIeCompat: true } }
        ]
      }
    ],
  },
  resolve: {
    alias: {
      evoozer: path.resolve(__dirname, '../../packages/evoozer')
    }
  },
  plugins
};