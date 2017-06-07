/*
 * @Author: wxq
 * @Date:   2017-04-27 16:37:06
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-01 15:18:34
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\view.js
 * @File Name: view.js
 * @Descript: 
 */
'use strict';
import mapTool from '../util/mapToolUtil';
const ol = require('ol');

export default class view {
    constructor(geo, map) {

        this.map = map;
        mapTool.map = map;
        this._panFunction = function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

        };
        const view = this.init(geo);
        return view;

    }

    init({
        scaleLimit = [2, 18],
        roam = true,
        center = [118.62778784888256, 36.58892145091036],
        zoom = 3,
        projection = 'EPSG:3857'
    }) {

        let minZoom = scaleLimit[0];
        let maxZoom = scaleLimit[1];
        //限制缩放
        if (roam === 'false' || roam === false || roam == 'drag') {

            minZoom = zoom;
            maxZoom = zoom;

        }
        //限制平移
        if (roam === 'false' || roam === false || roam == 'scale') {

            this.map.on('pointerdrag', this._panFunction);

        } else {

            this.map.un('pointerdrag', this._panFunction);

        }

        let view = new ol.View({
            center: mapTool.transform(center, projection),
            zoom: zoom,
            enableRotation: false,
            minZoom: minZoom,
            maxZoom: maxZoom,
            projection: projection
                // extent: []

        });

        return view;

    }
}