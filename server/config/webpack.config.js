/**
 * Base webpack config. webpack.production.config uses this base
 * and adds some optimizations.
 */

const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

const serverConfig = require('./config.js');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack/hot/dev-server',
      path.join(__dirname, '../../client/index.jsx')
    ]
  },
  output: {
    path: path.join(__dirname, '../../public'),
    filename: 'js/[name].[hash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      path.join(__dirname, '../../client'),
      'node_modules'
    ]
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        include: [
          path.join(__dirname, '../../client'),
          path.join(__dirname, '../../shared')
        ],
        exclude: [
          path.join(__dirname, '../../node_modules')
        ]
      },
      {
        test: /\.[s]css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: 'inline',
              plugins: function() {
                return [
                  require('precss'),
                  require('autoprefixer')
                ]
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // Using an ejs template here in case we want to add
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../../client/index.ejs'),
      hash: true,
      title: serverConfig.title,
      minify: {
        collapseWhitespace: false
      }
    })
  ]
};
