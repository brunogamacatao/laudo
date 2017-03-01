const webpack = require('webpack'); //to access built-in plugins
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: ['promise-polyfill', 'whatwg-fetch', './client/src/js/app.js'],
  output: {
    path: path.join(__dirname, 'client/dist'),
    filename: 'app.bundle.js'
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      comments: false,

    }),
    new HtmlPlugin({
      template: 'client/src/index.html'
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    }),    
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: /src/,
        loaders: ['babel-loader']
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
      {test: /(pdfkit|png-js|fontkit|unicode-properties|brotli)/, loader: 'transform?brfs'},
      {test: /\.json$/, loader: 'json'}      
    ]
  }
};
