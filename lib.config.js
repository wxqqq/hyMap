/*
 * @Author: wxq
 * @Date:   2017-01-10 10:15:18
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-08-23 00:03:20
 * @Email: zhangyujie3344521@163.com
 * @File Path: F:\work\hyMap\lib.config.js
 * @File Name: lib.config.js
 * @Descript:
 */

'use strict';
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        libraryTarget: 'commonjs2',
        library: 'visual',
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js'
    },
    resolve: {
        alias: {
            ol: path.join(__dirname, '/public/lib/ol'),
            turf: path.join(__dirname, '/public/lib/turf.min')
        }
    },
    devtool: false,
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader','css-loader']
        }, {
            test: /\.js?$/,
            use: 'babel-loader',
            include: __dirname
        }, {
            test: /\.json$/,
            use: 'json-loader'
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};