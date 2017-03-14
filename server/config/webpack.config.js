const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const Config = require('./config.js');


module.exports = {
  devtool: 'eval',
  entry: {
    app: [
      path.join(__dirname, '../../client/index.jsx')
    ]
  },
  output: {
    path: path.join(__dirname, '../../public/js'),
    filename: '[name].[hash].js',
    publicPath: '/js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: [
      path.resolve('../../client')
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../../client/index.ejs'),
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
  historyApiFallback: true,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: [
          path.join(__dirname, '../../client'),
          path.join(__dirname, '../../shared')
        ]
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
