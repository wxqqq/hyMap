/*
 * @Author: wxq
 * @Date:   2017-01-10 10:15:18
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-09-12 13:59:19
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
        filename: 'index.dev.js'
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
            loader: 'babel-loader',
            include: __dirname
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },
    plugins: [

    ]
};