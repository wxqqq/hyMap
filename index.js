/*
 * @Author: FunctionRun
 * @Date:   2017-01-10 10:15:25
 * @Last Modified by:   hydata
 * @Last Modified time: 2017-01-12 10:12:21
 * @Email: zhangyujie3344521@163.com
 * @File Path: /Users/zhangyujie/GitHub/FEscaffold/index.js
 * @File Name: index.js
 * @Descript:
 */

'use strict';
require('./css/index.css');

import React from 'react';
import {
    render
} from 'react-dom';
import {
    Router,
    Link,
    browserHistory,
    IndexRoute
} from 'react-router';
import rootRoute from './routes';

render(
    <Router history = {browserHistory} routes = {rootRoute} />,
    document.body.querySelector('.container')
);