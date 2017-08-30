/*
 * @Author: wxq
 * @Date:   2017-04-27 14:37:24
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-08-21 16:17:13
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\util\mapToolUtil.js
 * @File Name: mapToolUtil.js
 * @Descript:
 */
'use strict';
import baseUtil from './baseUtil';

/**
 * mapToolUtil
 * @module  mapToolUtil
 */
const ol = require('ol');

let map = undefined;
/**
 * 根据坐标获取经纬度
 * @author WXQ
 * @date   2017-03-24
 * @param  {(Array)}   coords 坐标 
 * @return {Array}          像素
 */
function getPixelFromCoords(coords) {

    if (!coords) {

        return;

    }
    const newcoords = transform(coords);
    return this.map.getPixelFromCoordinate(newcoords);

}

/**
 * 根据级别获取分辨率
 * @author WXQ
 * @date   2017-04-18
 * @param  {(number)}   zoom 级别
 * @return {(number)}        分辨率
 */
function getResolutionByZoom(zoom, view) {

    if (zoom) {

        return view.constrainResolution(
            view.getMaxResolution(), zoom - view.getMinZoom());

    }

}
/**
 * 坐标转换
 * @author WXQ
 * @date   2017-04-18
 * @param  {(array)}   coords    坐标
 * @param  {(string)}   projection 投影
 * @return {(array)}              坐标
 */
function transform(coords, projection) {

    if (baseUtil.isString(coords)) {

        coords = this.deleteEndSign(coords, ';');
        const str = coords.split(';');

        coords = (str.length > 0) ? str[0].split(',') : [0, 0];

    }
    if (coords[0] > 1000) {

        return coords;

    } else {

        return ol.proj.fromLonLat([Number(coords[0]), Number(coords[1])], projection);

    }

}

/**
 * 清除结尾的符号
 * @author WXQ
 * @date   2017-07-07
 * @param  {(string)}   str  字符串
 * @param  {(string)}   sign 符号
 * @return {(string)}        字符串
 */
function deleteEndSign(str, sign) {

    return (str.substring(str.length - 1) == sign) ? str.substring(0, str.length - 1) : str;

}

/**
 * 获取两点间的距离
 * @param  {Array} first  第一个点
 * @param  {Array} second 第二个点
 * @return {Number}        距离
 */
function getDistance(first, second) {

    var wgs84Sphere = new ol.Sphere(6378137);

    const distance = wgs84Sphere.haversineDistance(first, second);
    return distance;

}

const mapToolUtil = {
    map: map,
    transform: transform,
    getResolutionByZoom: getResolutionByZoom,
    getPixelFromCoords: getPixelFromCoords,
    deleteEndSign: deleteEndSign,
    getDistance: getDistance
};
export default mapToolUtil;