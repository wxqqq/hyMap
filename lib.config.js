/*
 * @Author: wxq
 * @Date:   2017-01-10 10:15:18
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-03-28 16:57:27
 * @Email: zhangyujie3344521@163.com
 * @File Path: /Users/zhangyujie/GitHub/FEscaffold/webpack.lib.js
 * @File Name: webpack.lib.js
 * @Descript:
 */

'use strict';
const webpack = require('webpack');

module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        libraryTarget: 'commonjs2',
        library: 'visual',
        path: './dist',
        filename: 'index.js'
    },
    externals: {
        "ol": "window.ol"
    },
    devtool: false,
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style!css'
        }, {
            test: /\.js?$/,
            loader: 'babel-loader',
            include: __dirname
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },

    babel: {
        presets: ['es2015', 'react', 'stage-3'],
        plugins: ['transform-object-rest-spread', 'transform-class-properties']
    }
};