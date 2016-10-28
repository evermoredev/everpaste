const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Config = require('./config.js');

const webpackConfig = {
  devtool: 'eval',
  entry: {
    app: [
      './src/index.jsx'
    ]
  },
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    root: [
      path.resolve('./src')
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.ejs'),
      filename: '../index.html',
      hash: false,
      title: Config.default.title,
      favicon: Config.default.favicon,
      logo: Config.default.logo,
      minify: {
        collapseWhitespace: false
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: path.join(__dirname, './src')
      },
      {
        test: /\.[s]css$/,
        loaders: [
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader?sourceMap=inline'
        ]
      }
    ]
  },
  postcss: function (webpack) {
    return [
      require('postcss-smart-import')({
        addDependencyTo: webpack
      }),
      require('precss')(),
      require('autoprefixer')(),
    ];
  }
};

module.exports = webpackConfig;
