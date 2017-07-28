/*
 * @Author: wxq
 * @Date:   2017-04-26 17:13:23
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-07-17 13:55:36
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\track.js
 * @File Name: track.js
 * @Descript: 
 */
'use strict';
import baseUtil from '../util/baseUtil';


const ol = require('ol');

export default class track {
    constructor(options) {

        this.trackLayer = undefined;
        this.trackSource = undefined;
        this.trackOverlayArray = [];
        this.url = 'http://192.168.1.50:8080/geoserver/hygis/wfs?sversion=1.0.0&request=GetFeature&outputFormat=application%2Fjson';
        this.map = undefined;
        this.tooltipFun = () => undefined;
        this._createTrackOverLay();

    }

    set(option) {

    }

    get(option) {

    }

    createLayer() {

        let group = this.addLayer({
            series: [{
                symbolStyle: {
                    'normal': {
                        strokeColor: '#2dbc60',
                        strokeWidth: 3
                    },
                    'emphasis': {
                        strokeColor: 'green',
                        strokeWidth: 4
                    }
                }
            }]

        });
        this.trackLayer = group.layerGroup.getLayers().getArray()[0];
        this.trackSource = this.trackLayer.getSource();

    }

    /**
     * 清空轨迹线
     */
    clearLayer() {

        this.trackLayer.getSource().clear();

    }
    createOverlay(coordinate, str = '') {

        let overlay = this._createOverlay();
        let div = overlay.getElement();

        div.innerHTML = str;
        overlay.setPosition(this.transform(coordinate));
        this.trackOverlayArray.push(overlay);

    }

    /**
     * 清空轨迹tooltip
     */
    clearOverlay() {

        this.trackOverlayArray.forEach((overlay) => {

            this.map.removeOverlay(overlay);

        });
        this.trackOverlayArray = [];

    }

    clear() {

        this.clearOverlay();
        this.clearLayer();

    }

    /**
     * 绘制轨迹
     * @param  {Array}   start              [description]
     * @param  {Array}   end                [description]
     * @param  {Function}   options.callback   [description]
     * @param  {Function}   options.tooltipFun [description]
     */
    drawTrack(start, end, {
        callback = undefined,
        tooltipFun = undefined
    } = {}) {

        //起始点一致，不进行查询
        if (start.toString() == end.toString()) {

            return;

        }

        const viewparams = ['x1:' + start[0], 'y1:' + start[1], 'x2:' + end[0], 'y2:' + end[1]];
        this.url += '&typeName=' + 'routing_sd' + '&viewparams=' + viewparams.join(';');
        // this.url = 'http://localhost:3000/routing';

        // let formData = new FormData();
        // formData.append("start", start);
        // formData.append("end", new ol.format.WKT().writeGeometry(end.getGeometry()));

        // let data = JSON.stringify({
        // start: start,
        // end: new ol.format.WKT().writeGeometry(end.getGeometry().clone().transform('EPSG:3857', "EPSG:4326"))
        // });
        fetch(this.url, {
            // mode: "cors",
            // headers: {
            // "Content-Type": "application/x-www-form-urlencoded",
            // 'Content-Type': 'application/json'
            // },
            // method: 'POST',
            // body: data

        }).then((response) => {

            return response.json();

        }).then((data) => {

            var features = new ol.format.GeoJSON().readFeatures(data, {
                featureProjection: 'EPSG:3857'
            });
            if (baseUtil.isFunction(callback)) {

                callback(features[0]);

            } else {

                this.drawCallback(features);

            }



            if (tooltipFun) {

                const geometry = features[0].getGeometry().clone();
                const length = geometry.getLength();

                const time = Math.ceil(length / 1000 * 60 / 60);

                let str = baseUtil.isFunction(tooltipFun) ? tooltipFun({
                    length,
                    time
                }) : tooltipFun;

                this.dispachevent({
                    type: 'trackTooltip',
                    data: {
                        length,
                        time
                    }

                });

                if (str) {

                    this._createTrackOverLay(start, str);

                }

            }

        }).catch(function(e) {

            console.log(e);

        });

    }
    drawCallback(features, start, end) {

        this.trackLayer.getSource().addFeatures(features);

    }
}