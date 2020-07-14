const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'none',
    entry: [
        './src/main.js'
    ],
    output: {
        filename:'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: "dist/"
    },
    devServer: {
        hot: true,
        watchOptions: {
            poll: true
        }
    },
    module: {
        rules: [
            {
                //处理less文件的
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                //处理css文件
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                //处理js文件
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env']
                    }
                }
            },
            {
                //处理.vue文件
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                //处理图片文件
                test: /\.png$/,
                use: {
                    loader:'url-loader',
                    options: {
                        limit: 10 * 1024
                    }
                },

            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title: 'Webpack Plugin Sample',
            // template: './public/index.html',
        }),
        new webpack.DefinePlugin({
            BASE_URL:'.'
        })
    ]
}