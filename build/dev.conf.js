const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConf = require('./base.conf')

module.exports = merge(baseConf, {
    mode: 'development',
    entry: {
        app: ['webpack-hot-middleware/client?reload=true', path.resolve(__dirname, '../src/main')]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        sourceMapFilename: '[file].map'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'Game',
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.html'),
            chunk: ['app'],
            inject: true,
        })
    ]
})