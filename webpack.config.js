const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/main.js',
  },
  plugins: [
    new CleanWebpackPlugin(['docs']),
    new CopyWebpackPlugin([
      { from: './assets', to: './assets' },
      { from: './impress.js', to: './lib/impress.js' }
    ]),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    // new HtmlWebpackIncludeAssetsPlugin({ assets: [], append: true }),
    new webpack.ProvidePlugin({
      _w: path.resolve(__dirname, './defineWidth.js'),
      _h: path.resolve(__dirname, './defineHeight.js'),
    }),
  ],
  output: {
    filename: '[hash].bundle.js',
    path: path.resolve(__dirname, 'docs'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              // Stage 0
              '@babel/plugin-proposal-function-bind',

              // Stage 1
              '@babel/plugin-proposal-export-default-from',
              '@babel/plugin-proposal-logical-assignment-operators',
              ['@babel/plugin-proposal-optional-chaining', { loose: false }],
              [
                '@babel/plugin-proposal-pipeline-operator',
                { proposal: 'minimal' },
              ],
              [
                '@babel/plugin-proposal-nullish-coalescing-operator',
                { loose: false },
              ],
              '@babel/plugin-proposal-do-expressions',

              // Stage 2
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              '@babel/plugin-proposal-function-sent',
              '@babel/plugin-proposal-export-namespace-from',
              '@babel/plugin-proposal-numeric-separator',
              '@babel/plugin-proposal-throw-expressions',

              // Stage 3
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-syntax-import-meta',
              ['@babel/plugin-proposal-class-properties', { loose: false }],
              '@babel/plugin-proposal-json-strings',
            ],
          },
        },
      },
    ],
  },
};
