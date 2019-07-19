const fs = require('fs');
const path = require('path');
const ExternalsPlugin = require('webpack-externals-plugin');

module.exports = {
  mode: process.env.MODE || 'development',

  entry: path.resolve(__dirname, 'server/server.js'),

  output: {
    path: __dirname + '/dist/',
    filename: 'server.bundle.js',
  },

  target: 'node',

  node: {
    __filename: true,
    __dirname: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: [
            [
              'css-modules-transform',
              {
                generateScopedName: '[hash:base64]',
              }
            ]
          ]
        },
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.css$|\.scss$/,
        loader: 'null-loader',
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$/i,
        loader: 'null-loader',
      },
    ],
  },
  plugins: [
    new ExternalsPlugin({
      type: 'commonjs',
      include: path.join(__dirname, './node_modules/'),
    }),
  ],
};
