const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const JS_OUTPUT_PATH = 'dist'
const PUBLIC_PATH = 'asserts'
const JS_NAME = 'js/[name].js'

module.exports = function (env, argv) {
  const devtool = {
    development: 'source-map',
    production: 'none'
  }
  const options = {
    devtool: devtool[argv.mode],
    entry: {
      options: './src/options/index.js',
      popup: './src/popup/index.js',
      background: './src/background/index.js'
    },
    output: {
      publicPath: PUBLIC_PATH,
      filename: JS_NAME,
      path: path.resolve(__dirname, JS_OUTPUT_PATH)
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader'
        },
        include: [path.resolve('src')]
      }, {
        test: /\.less$/,
        use: [
          'css-loader',
          'less-loader'
        ]
      }, {
        test: /\.css$/,
        use: [
          'css-loader'
        ]
      }]
    },
    optimization: {
      usedExports: true
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, './dist/'),
        to: path.resolve(__dirname, './public/asserts/'),
        transformPath: (targetPath, absolutePath) => {
          return targetPath.replace(/dist\//, '')
        }
      }])
    ]
  }

  return options
}
