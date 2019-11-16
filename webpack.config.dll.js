const path = require('path')
const Webpack = require('webpack')

const OUTPUT_PATH = './dist/js'
const NAME = 'dll'

module.exports = function (env, argv) {
  const options = {
    entry: ['react', 'react-dom'],
    output: {
      filename: `${NAME}.js`,
      path: path.resolve(__dirname, OUTPUT_PATH),
      library: NAME
    },
    plugins: [
      new Webpack.DllPlugin({
        name: NAME,
        path: path.resolve(__dirname, 'dist/dll.manifest.json')
      })
    ]
  }

  return options
}
