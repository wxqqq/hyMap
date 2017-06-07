/*
 * @Author: wxq
 * @Date:   2017-04-26 21:06:23
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-01 11:19:24
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\gpsLayer.js
 * @File Name: gpsLayer.js
 * @Descript: 
 */
'use strict';
import hylayer from './hyLayer';
import mapTool from '../../util/mapToolUtil';

const ol = require('ol');

export default class gpsLayer extends hylayer {
    constructor(options) {

        // layeranimate 增加，移除，更新
        // track 动画，回放
        // event tooltipshow tooltiphide
        super(options);
        this.layer;
        this.source;
        this.data;
        this.init();
    }

    init() {

        this.source = new ol.source.Vector();
        this.layer = new ol.layer.Vector({
            source: this.source,
            style: this.styleFun
        });
        return this.layer;

    }

    initStyle() {


    }

    styleFun(feature) {

        // console.log(feature);

    }
    update(data) {

        data.forEach((value) => {

            let coords = value.geoCoord;
            coords = mapTool.transform([Number(coords[0]), Number(coords[1])]);
            const geometry = this.createGeometry(value.geoCoord);

            let feature = this.source.getFeatureById(value.id);
            if (feature) {

                feature.setGeometry(geometry);

            } else {
                this.createFeature(value);
            }

        });

        // this.source.forEach()

    }
    createGeometry(geoCoord) {

        let coords = geoCoord;
        coords = mapTool.transform([Number(coords[0]), Number(coords[1])]);
        const geometry = new ol.geom.Point(coords);
        return geometry;

    }
    createFeature(value) {

        const geometry = this.createGeometry(value.geoCoord);
        let gpsFeature = new ol.Feature({
            geometry: geometry
        });
        gpsFeature.setId(value.id);
        gpsFeature.setProperties(value);
        this.source.addFeature(gpsFeature);

    }

    remove(id) {

        const feature = this.source.getFeatureById(id);
        this.source.removeFeature(feature);

    }

    clear() {

        this.source.clear();

    }

    /**
     * [dispose description]
     * @author WXQ
     * @date   2017-05-03
     * @return {[type]}   [description]
     */
    dispose() {

    }
}