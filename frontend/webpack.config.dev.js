const webpack = require('webpack');

exports.cssLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: '[name]-[hash:base64]',
    },
    importLoaders: 1,
    sourceMap: true,
  },
};

module.exports = {
  mode: process.env.MODE || 'development',
  devtool: '#sourcemap',

  entry: {
    app: [
      'webpack-hot-middleware/client',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      './client/index.js',
    ],
    vendor: [
      'react',
      'react-dom',
    ],
  },

  output: {
    path: __dirname,
    filename: 'app.js',
    publicPath: 'http://0.0.0.0:8000/',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'assets',
      'components',
      'modules',
      'node_modules',
    ],
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader?singleton',
          exports.cssLoader,
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader?singleton',
          exports.cssLoader,
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      }, {
        test: /\.jsx*$/,
        exclude: [/node_modules/, /.+\.config.js/],
        loader: 'babel-loader',
      }, {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.otf$|\.ttf$/i,
        loader: 'url-loader?limit=10000',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.SplitChunksPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.js',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        CLIENT: JSON.stringify(true),
        NODE_ENV: JSON.stringify('development'),
      }
    }),
  ],
};
