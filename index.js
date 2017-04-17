/*
 * @Author: FunctionRun
 * @Date:   2017-01-10 10:15:25
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-04-14 14:15:38
 * @Email: zhangyujie3344521@163.com
 * @File Path: H:\work\hyMap\index.js
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