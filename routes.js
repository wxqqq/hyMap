/*
 * @Author: zhangyujie
 * @Date:   2016-05-09 11:31:09
 * @Last modified by:   deyuhua
 * @Last modified time: 2016-06-30T14:58:24+08:00
 * @Email: zhangyujie3344521@163.com
 * @File Path: F:\work\hyMap\routes.js
 * @File Name: routes.js
 * @Descript:
 */

'use strict';
import React from 'react';
import {
    Route,
    Link,
    IndexRoute
} from 'react-router';
import {
    App,
    rect,
    icon,
    line,
    chart,
    labelAnimate,
    mapmethod,
    heatmap,
    ripple,
    gps,
    featureanimat,
    region
} from './test/container/index';


const route = (
    <Route path='/' component={App}>
     <IndexRoute component={mapmethod}/>
        <Route path = 'chart' component = {chart} />
        <Route path = 'icon' component = {icon} />
        <Route path = 'labelAnimate' component = {labelAnimate} />
        <Route path = 'line' component = {line} />
        <Route path = 'rect' component = {rect} />
        <Route path = 'mapmethod' component = {mapmethod} />
        <Route path = 'heatmap' component = {heatmap} />
        <Route path = 'ripple' component = {ripple} />
        <Route path = 'gps' component = {gps} />
        <Route path = 'featureanimat' component = {featureanimat} />
        <Route path = 'region' component = {region} />
    </Route>
);

export default route;