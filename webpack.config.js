const path = require('path')
const Webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const JS_OUTPUT_PATH = 'dist'
const PUBLIC_PATH = 'asserts'
const JS_NAME = 'js/[name].js'
const CSS_NAME = 'css/[name].css'

module.exports = function (env, argv) {
  const devtool = {
    'development': 'cheap-source-map',
    'production': 'none'
  }
  const options = {
    devtool: devtool[argv.mode],
    entry: {
      options: './src/options/index.js',
      // popup: './src/popup/index.js',
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
        }
      }, {
        test: /\.less$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      }, {
        test: /\.css$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }]
    },
    optimization: {
      usedExports: true
    },
    plugins: [
      // new MiniCssExtractPlugin({
      //   filename: CSS_NAME
      // }),
      new Webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, 'dist/dll.manifest.json')
      }),
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, './dist/**/*'),
        to: path.resolve(__dirname, './public/asserts/'),
        transformPath: (targetPath, absolutePath) => {
          return targetPath.replace(/dist\//, '')
        }
      }])
    ]
  }

  return options
}
