const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");

module.exports = merge(common ,{
    //启动webpack-server-dev
    mode: 'development',
    devtool: 'source-map',
    devServer:{
        compress: true,
        port: 8000,
        open: false,
        hot: true
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
})