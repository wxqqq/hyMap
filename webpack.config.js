/*
 * @Author: FunctionRun
 * @Date:   2017-01-10 10:15:18
 * @Last Modified by:   FunctionRun
 * @Last Modified time: 2017-01-10 11:37:31
 * @Email: zhangyujie3344521@163.com
 * @File Path: /Users/zhangyujie/GitHub/FEscaffold/webpack.config.js
 * @File Name: webpack.config.js
 * @Descript:
 */

'use strict';

const path = require('path');
const webpack = require('webpack');

const libJson = require('./lib_manifest.json');

// const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
const hostConfig = {
    host: 'localhost',
    port: '8110'
};
const publicPath = '/build/';

let webpackConfig = {
    entry: [
        './index.js'
    ],
    resolve: {
        root: '',
        extensions: ['', '.js', '.json', '.css', '.styl', '.sass', '.scss']
    },
    output: {
        path: path.join(__dirname, 'build'),
        chunkFilename: 'chunk/[chunkhash:8].chunk.min.js',
        filename: 'bundle.js',
        publicPath
    },
    devServer: {
        host: hostConfig.host,
        port: hostConfig.port,
        historyApiFallback: true
    },
    devtool: 'cheap-source-map',
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style!css'
        }, {
            test: /\.js?$/,
            loader: 'babel-loader',
            include: [
                // 只去解析运行目录下的 src
                path.join(process.cwd(), './main.js'),
                path.join(process.cwd(), './src'),
                path.join(process.cwd(), './test')
            ]
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=25000'
        }]
    },
    babel: {
        presets: ['es2015', 'react', 'stage-3'],
        plugins: ['transform-object-rest-spread', 'transform-class-properties']
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: libJson
        })

    ]
};

// 开发环境下的配置
if (process.env.NODE_ENV === 'DEVELOPMENT') {

    webpackConfig = Object.assign(webpackConfig, {
        entry: [
            'webpack/hot/dev-server',
            './index.js' //, 
            // hotMiddlewareScript
        ],
        output: {
            path: path.join(__dirname, 'build'),
            filename: 'bundle.js',
            chunkFilename: 'chunk/[chunkhash:8].chunk.min.js',
            publicPath: 'http://' + hostConfig.host + ':' + hostConfig.port + publicPath
        },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: libJson
            }),
            new webpack.HotModuleReplacementPlugin()
        ]
    });

}

module.exports = webpackConfig;