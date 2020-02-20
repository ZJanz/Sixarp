const path = require('path');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const WEBPACK_DEV_SERVER_PORT = 32488;

module.exports = env => {
  if (!env) {
    env = { NODE_ENV: process.env.NODE_ENV };
  }
  console.log(`[webpack.config.js] Executing in mode: ${env.NODE_ENV || 'NOT SET, defaults to development'}`)
  return {
    mode: env.NODE_ENV === 'production' ? 'production' : 'development',
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
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  "@babel/preset-react",
                  "@babel/preset-env"
                ]
              }
            }
          ]
        },
        {
          test: /\.s[ac]ss$/,
          exclude: /node_modules/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.bundle\.js$/,
          use: 'bundle-loader'
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
          { from: 'client/src/static', to: '.' }
        ]),
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, './src/static/index.html'),
          filename: 'index.html',
          inject: 'body'
        }),
        new CleanWebpackPlugin()
      ];

      if (env !== 'production') {
        ret.push(new webpack.NamedModulesPlugin());
        ret.push(new webpack.HotModuleReplacementPlugin());
      }

      return ret;
    })(process.env.NODE_ENV),
    output: {
      path: path.join(__dirname, '/dist'),
      chunkFilename: '[name].bundle.[hash].js',
      publicPath: '/',
      filename: '[name].[hash].js'
    },
    optimization: ((env) => {
      const ret = {
        splitChunks: {
          chunks: 'all'
        }
      };

      if (env === 'production') {
        ret.minimizer = [new UglifyJsPlugin()];
      }

      return ret;
    })(process.env.NODE_ENV),
    devServer: {
      contentBase: './dist',
      compress: true,
      hot: true,
      port: WEBPACK_DEV_SERVER_PORT
    }
  }
};