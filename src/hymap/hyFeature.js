/*
 * @Author: wxq
 * @Date:   2017-04-18 09:51:02
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-14 16:23:42
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\hymap\hyFeature.js
 * @File Name: hyFeature.js
 * @Descript: 
 */
'use strict';
import baseUtil from '../util/baseUtil';
import mapTool from '../util/mapToolUtil';

const ol = require('ol');

export default class hyFeature {
    constructor(options) {

        // super(options);

        return this._createFeature();
    }

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

    static _createFeature(type, data) {

        let feature = new ol.Feature({
            geometry: this._createGeometry(type, data.geoCoord)
                // dataIndex: new Date().getTime()

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
     * @param  {[type]} type [description]
     * @param  {[type]} obj  [description]
     * @return {[type]}      [description]
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

        } else
        if (type == 'polygon') {

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
    static createLine(data) {

        let coords = [];
        data.forEach((obj) => {

            coords.push(mapTool.transform(obj.geoCoord));

        });

        const geometry = new ol.geom.LineString(coords);
        return geometry;

    }
}