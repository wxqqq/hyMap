/*
 * @Author: wxq
 * @Date:   2017-04-18 09:51:02
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-07-17 10:23:44
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\feature\hyFeature.js
 * @File Name: hyFeature.js
 * @Descript: 
 */
'use strict';
import baseUtil from '../../util/baseUtil';
import mapTool from '../../util/mapToolUtil';

const ol = require('ol');

export default class hyFeature {
    /**
     * 初始化
     * @param  {Object}   options 参数
     */
    constructor(options) {

        // super(options);
        return this._createFeature();

    }

    /**
     * 构建features对象
     * @param  {Object} data 数据
     * @param  {String} type 类型
     * @return {Object}  {features,max,min}    结果对象
     */
    static getFeatures(data, type) {

        let features = [];
        let valueArray = [];
        data.map((obj, index) => {

            let feature = this._createFeature(type, obj);

            features.push(feature);
            valueArray.push(obj.value);


        });
        const max = Math.max(...valueArray);
        const min = Math.min(...valueArray);
        return {
            features,
            max,
            min
        };

    }

    /**
     * 构建feature对象
     * @param   {String} type 类型
     * @param   {Object} data 数据
     * @return  {feature} feature feature对象
     * @private
     */
    static _createFeature(type, data) {

        let feature = new ol.Feature({
            geometry: this._createGeometry(type, data.geoCoord)

        });
        feature.setProperties(data);

        feature.setId('serie|' + data.geoCoord);
        // const featurestyle = this._createGeoStyle(serie.itemStyle, serie.label);
        // feature.set('style', featurestyle);
        // 
        return feature;

    }

    /**
     * 创建空间对象
     * @param  {String} type 类型
     * @param  {Array|String} geoCoord  坐标
     * @return {Object} geometry 空间对象
     */
    static _createGeometry(type, geoCoord) {

        let geometry = null;
        let coords = [];
        if (baseUtil.isString(geoCoord)) {

            geoCoord = mapTool.deleteEndSign(geoCoord, ';');
            const str = geoCoord.split(';');
            str.forEach((obj) => {

                const coord = obj.split(',');
                const coordinate = mapTool.transform(coord);
                coords.push(coordinate);

            });

        } else {

            coords = geoCoord;

        }

        if (type == 'line') {

            geometry = new ol.geom.LineString(coords);

        } else if (type == 'polygon') {

            geometry = new ol.geom.Polygon(coords);

        } else {

            if (coords.length == 1) {

                coords = coords[0];

            } else {

                coords = mapTool.transform(coords);

            }
            geometry = new ol.geom.Point(coords);

        }

        return geometry;

    }

    /**
     * 构造线对象
     * @param  {Object} data 数据
     * @return {Object}  geometry  空间对象
     */
    static createLine(data) {

        let coords = [];
        data.forEach((obj) => {

            coords.push(mapTool.transform(obj.geoCoord));

        });

        const geometry = new ol.geom.LineString(coords);
        return geometry;

    }
}