var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var DEV_MODE        = process.argv.indexOf("--dev-mode") >= 0;
var HOT_SERVER_PORT = 3000;
var SRC_PATH        = "/src";
var OUTPUT_PATH     = "/dist";
var STATIC_PATH     = "/static";
var JS_NAME         = "[name].js";
var CSS_NAME        = "[name].css";

var options = {
    // devtool: DEV_MODE ? 'eval-source-map' : 'hidden-eval',
    devtool: 'source-map',
    entry: {
        'options': './src/options/index.js',
        'popup': './src/popup/index.js'
    },
    output: {
        filename:   JS_NAME,
        path:       path.join(__dirname, OUTPUT_PATH),
        publicPath: OUTPUT_PATH
    },
    resolve: {
        root:       path.join(__dirname, SRC_PATH),
        extensions: ["", ".js", ".jsx"]
    },
    module: {
        loaders: [{
            test:    /\.less$/,
            loader:  ExtractTextPlugin.extract("css!less"),
            include: path.join(__dirname, SRC_PATH)
        }, {
            test:    /\.jsx?$/,
            loaders: DEV_MODE ? ['react-hot', 'babel'] : ['babel'],
            include: path.join(__dirname, SRC_PATH)
        }, {
            test:    /\.json$/,
            loader:  "json-loader",
            include: path.join(__dirname, STATIC_PATH)
        }]
    },
    devServer: {
        port:               HOT_SERVER_PORT,
        hot:                true,
        historyApiFallback: true,
        compress:           true,
        open:               true, // for webpack-dev-server versions > 2.0
        stats:              { colors: true },
        publicPath:         OUTPUT_PATH
    },
    plugins: [
        new ExtractTextPlugin(CSS_NAME)
    ]
}

if (DEV_MODE) {
    options.entry.unshift("webpack-dev-server/client?http://localhost:" + HOT_SERVER_PORT);
    options.entry.unshift("webpack/hot/only-dev-server");
    options.plugins.unshift(new webpack.HotModuleReplacementPlugin());
}

module.exports = options;