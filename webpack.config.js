const {readFileSync} = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var findCacheDir = require('find-cache-dir');

var ENV = process.env.NODE_ENV || 'development';

var common = {
  entry: './app/main.js',
  output: {
    filename: 'bundle.js',
    path: './dist'
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