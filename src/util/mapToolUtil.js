/*
 * @Author: wxq
 * @Date:   2017-04-27 14:37:24
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-05-08 16:23:21
 * @Email: 304861063@qq.com
 * @File Path: H:\work\hyMap\src\util\mapToolUtil.js
 * @File Name: mapToolUtil.js
 * @Descript: 
 */
'use strict';
import baseUtil from './baseUtil';
const ol = require('ol');

let map = undefined;
// let view = map.getView();
/**
 * 根据坐标获取经纬度
 * @author WXQ
 * @date   2017-03-24
 * @param  {[type]}   coords [description]
 * @return {[type]}          [description]
 */
function getPixelFromCoords(coords) {

    if (!coords) {

        return;

    }
    const newcoords = transform(coords);
    return this.map.getPixelFromCoordinate(newcoords);

}

/**
 * [getProjectionByZoom description]
 * @author WXQ
 * @date   2017-04-18
 * @param  {[type]}   zoom [description]
 * @return {[type]}        [description]
 */
function getProjectionByZoom(zoom, view) {

    if (zoom) {

        return view.constrainResolution(
            view.getMaxResolution(), zoom - view.getMinZoom());

    }

}
/**
 * [transform description]
 * @author WXQ
 * @date   2017-04-18
 * @param  {[type]}   coords     [description]
 * @param  {[type]}   projection [description]
 * @return {[type]}              [description]
 */
function transform(coords, projection) {

    if (baseUtil.isString(coords)) {

        coords = this.deleteEndSign(coords, ';');
        const str = coords.split(';');

        coords = (str.length > 0) ? str[0].split(',') : [0, 0];

    }
    return ol.proj.fromLonLat([Number(coords[0]), Number(coords[1])], projection);

}

function deleteEndSign(str, sign) {

    return (str.substring(str.length - 1) == sign) ? str.substring(0, str.length - 1) : str;

}
const mapToolUtil = {
    map: map,
    transform: transform,
    getProjectionByZoom: getProjectionByZoom,
    getPixelFromCoords: getPixelFromCoords,
    deleteEndSign: deleteEndSign
};
export default mapToolUtil;