var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var findCacheDir = require('find-cache-dir');
var merge = require('webpack-merge');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var ENV = process.env.NODE_ENV || 'development';

var common = {
  entry: './app/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /\.(html|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          cacheDirectory: findCacheDir({name: 'cached-scripts'})
        }
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'svelte-loader'
      }
    ]
  },
  devtool: 'inline-source-map'
}

var config;
if (ENV === 'production') {
  config = merge(common, {
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        template: './app/index.ejs',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      }),
      new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false
        },
        mangle: {
          screw_ie8: true
        },
        output: {
          comments: false,
          screw_ie8: true
        }
      })
    ]
  });
} else {
  config = merge(common, {
    devServer: {
      inline: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: './app/index.ejs'
      })
    ]
  })
}

module.exports = config;