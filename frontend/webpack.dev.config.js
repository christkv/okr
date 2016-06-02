var webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index.jsx'
  ],
  module: {
    loaders: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel'
    },
    // { test: /\.css$/, loader: 'style!css' }
    {
      test: /\.css?$/,
      loaders: [ 'style', 'raw' ],
      include: path.resolve(__dirname, '../')
    }
  ]

  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
