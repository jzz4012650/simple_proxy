const path = require('path');
const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SRC_PATH = './src';
const OUTPUT_PATH = './dist';
const STATIC_PATH = './static';
const JS_NAME = '[name].js';
const CSS_NAME = '[name].css';

module.exports = function(env, argv) {
  const devtool = {
    'development': 'source-map',
    'production': 'source-map'
  };
  const options = {
    devtool: devtool[argv.mode],
    entry: {
      // vendor: ['react', 'react-dom', 'react-redux', 'redux', 'redux-actions', 'redux-promise'],
      options: './src/options/index.js',
      // popup: './src/popup/index.js',
      // background: './src/background.js'
    },
    output: {
      filename: JS_NAME,
      path: path.resolve(__dirname, OUTPUT_PATH),
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader'
        }
      }, {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'less-loader'
        }]
      }],
    },
    plugins: [
      new CopyWebpackPlugin([{
        from: './public/**/*',
        to: './',
        transformPath(targetPath) {
          return targetPath.replace(/public\//, '');
        }
      }])
    ]
  };

  return options;
};
