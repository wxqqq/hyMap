/*
 * @Author: zhangyujie
 * @Date:   2016-05-09 11:31:09
 * @Last modified by:   deyuhua
 * @Last modified time: 2016-06-30T14:58:24+08:00
 * @Email: zhangyujie3344521@163.com
 * @File Path: /Users/zhangyujie/node/www/tueasy5.0/Visual/routes.js
 * @File Name: routes.js
 * @Descript:
 */

'use strict';
import React from 'react';
import {
    Route,
    IndexRoute
} from 'react-router';
import {
    App,
    circle,
    icon,
    line

} from './test/container/index';


const route = (
    <Route path="/" component={App}>

    <Route path = 'circle' component = {circle} />
     <Route path = 'icon' component = {icon} />
      <Route path = 'line' component = {line} />
    </Route>
)

export default route