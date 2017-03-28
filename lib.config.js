/*
 * @Author: FunctionRun
 * @Date:   2017-01-10 10:15:18
 * @Last Modified by:   hydata
 * @Last Modified time: 2017-01-11 18:16:22
 * @Email: zhangyujie3344521@163.com
 * @File Path: /Users/zhangyujie/GitHub/FEscaffold/webpack.lib.js
 * @File Name: webpack.lib.js
 * @Descript:
 */

'use strict';
const webpack = require('webpack');

module.exports = {
    entry: [
        '../src/index.js'
    ],
    output: {
        path: 'public/lib',
        filename: '[name].js',
        library: '[name]'
    },

    module: {
        loaders: []
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'lib_manifest.json',
            name: '[name]',
            context: __dirname
        })
    ],
    babel: {
        presets: ['es2015', 'react', 'stage-3'],
        plugins: ['transform-object-rest-spread', 'transform-class-properties']
    }
};