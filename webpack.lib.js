/*
* @Author: FunctionRun
* @Date:   2017-01-10 10:15:18
* @Last Modified by:   FunctionRun
* @Last Modified time: 2017-01-10 11:17:29
* @Email: zhangyujie3344521@163.com
* @File Path: /Users/zhangyujie/GitHub/FEscaffold/webpack.lib.js
* @File Name: webpack.lib.js
* @Descript:
*/

'use strict';
const webpack = require('webpack');

const libs = [
    
];
module.exports =  {
    output: {
        path: 'public/lib',
        filename: '[name].js',
        library: '[name]'
    },
    entry: {
        libs
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
    ]
};
