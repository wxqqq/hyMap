/*
 * @Author: FunctionRun
 * @Date:   2017-01-10 10:15:25
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-07-24 16:14:20
 * @Email: zhangyujie3344521@163.com
 * @File Path: F:\work\hyMap\index.js
 * @File Name: index.js
 * @Descript:
 */

'use strict';
require('./css/index.css');

import React from 'react';
import { render } from 'react-dom';
import { Router, Link, browserHistory, IndexRoute } from 'react-router';
import RootRoute from './routes';

render(
    <Router history = {browserHistory} routes = {RootRoute} />,
    document.body.querySelector('.container')
);