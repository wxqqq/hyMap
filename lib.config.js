/*
 * @Author: wxq
 * @Date:   2017-01-10 10:15:18
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-07 14:08:22
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
        path: './dist',
        filename: 'index.js'
    },
    resolve: {
        alias: {
            ol: path.join(__dirname, '/public/lib/ol')
        }
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
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    babel: {
        presets: ['es2015', 'react', 'stage-3'],
        plugins: ['transform-object-rest-spread', 'transform-class-properties']
    }
};