const path = require('path');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log(`[webpack.config.js] Executing in mode: ${process.env.NODE_ENV || 'NOT SET'}`)

const WEBPACK_DEV_SERVER_PORT = 32488;

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-hot-loader/patch'
    ],
    app: [
      `webpack-dev-server/client?http://localhost:${WEBPACK_DEV_SERVER_PORT}`,
      path.resolve(__dirname, './src/js/index.js')
    ]
  },
  module: {
    rules: [
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devtool: 'inline-source-map',
  plugins: ((env) => {
    const ret = [
      new CopyWebpackPlugin([
        { from: 'src/static', to: '.' }
      ]),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/static/index.html'),
        filename: 'index.html',
        inject: 'body'
      })
    ];

    if (env !== 'production') {
      ret.push(new webpack.NamedModulesPlugin());
      ret.push(new webpack.HotModuleReplacementPlugin());

    }

    return ret;
  })(process.env.NODE_ENV),
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: '[name].[hash].js'
  },
  devServer: {
    contentBase: './dist',
    compress: true,
    hot: true,
    port: WEBPACK_DEV_SERVER_PORT
  }
};