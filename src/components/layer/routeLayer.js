/*
 * @Author: wxq
 * @Date:   2017-04-26 17:13:23
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-09-01 17:55:39
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\track.js
 * @File Name: track.js
 * @Descript: 
 */
'use strict';
import baseUtil from '../../util/baseUtil';


const ol = require('ol');

export default class routeLayer {
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

    _createTrackOverLay(coordinate, content, isCustom) {

            let overlay = this.createOverlay(null, isCustom);
            let div = overlay.getElement();
            if (baseUtil.isDom(content)) {

                div.appendChild(content);

            } else {

                div.innerHTML = content;

            }

            overlay.setPosition(mapTool.transform(coordinate));
            this.trackOverlayArray.push(overlay);
            return overlay;

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
    drawTrack(
        start,
        end, {
            callback = undefined,
            tooltipFun = undefined,
            isCustom = false
        } = {}
    ) {
        if (!start || !end) {
            return;
        }
        //起始点一致，不进行查询
        if (start.toString() == end.toString()) {
            return;
        }
        const viewparams = [
            'tbname:' + "'road_jining'",
            'x1:' + start[0],
            'y1:' + start[1],
            'x2:' + end[0],
            'y2:' + end[1]
        ];
        let url = 'http://localhost:3000/routing';
        url =
            this._serverUrl +
            '/hygis/wfs?sversion=1.0.0&request=GetFeature&outputFormat=application%2Fjson';
        url += '&typeName=' + 'Route' + '&viewparams=' + viewparams.join(';');

        // let formData = new FormData();
        // formData.append("start", start);
        // formData.append("end", new ol.format.WKT().writeGeometry(end.getGeometry()));

        // let data = JSON.stringify({
        // start: start,
        // end: new ol.format.WKT().writeGeometry(end.getGeometry().clone().transform('EPSG:3857', "EPSG:4326"))
        // });
        fetch(url, {
            // mode: "cors",
            // headers: {
            // "Content-Type": "application/x-www-form-urlencoded",
            // 'Content-Type': 'application/json'
            // },
            // method: 'POST',
            // body: data
        }).then(response => {
            return response.json();
        }).then(data => {
            let features = new ol.format.GeoJSON().readFeatures(data, {
                featureProjection: 'EPSG:3857'
            });

            let feature = features[0];

            var wgs84Sphere = new ol.Sphere(6378137);
            let first = ol.proj.transform(
                feature.getGeometry().getFirstCoordinate(),
                'EPSG:3857',
                'EPSG:4326'
            );
            let last = ol.proj.transform(
                feature.getGeometry().getLastCoordinate(),
                'EPSG:3857',
                'EPSG:4326'
            );
            const dis1 = wgs84Sphere.haversineDistance(start, first);
            const dis2 = wgs84Sphere.haversineDistance(start, last);
            let coords = feature.getGeometry().getCoordinates();
            dis1 > dis2 && coords.reverse(); //反向的路径进行坐标翻转
            coords.splice(0, 0, mapTool.transform(start)); //加入开始节点
            coords.push(mapTool.transform(end)); //加入最后节点
            feature.getGeometry().setCoordinates(coords);
            if (baseUtil.isFunction(callback)) {
                callback(features[0]);
            }

            this.trackLayer.getSource().addFeatures(features);

            if (tooltipFun) {
                const geometry = features[0].getGeometry().clone();
                const length = geometry.getLength();

                const time = Math.ceil(length / 1000 * 60 / 60);
                let overlay = this._createTrackOverLay(
                    start,
                    null,
                    isCustom
                );
                let element = overlay.getElement();

                let str = baseUtil.isFunction(tooltipFun) ? tooltipFun({
                        length,
                        time,
                        element
                    },
                    overlay.getElement()
                ) : tooltipFun;
            }
        }).catch((e) => {
            let overlay = this._createTrackOverLay(start, null, isCustom);
            let element = overlay.getElement();
            baseUtil.isFunction(tooltipFun) ? tooltipFun({
                    length: 0,
                    time: 0,
                    element
                },
                overlay.getElement()
            ) : tooltipFun;
            console.info(e);
        });
    }

    clearTrackInfo() {
        //清空轨迹线
        this.trackLayer.getSource().clear();
        //清空轨迹tooltip
        this.trackOverlayArray.forEach(overlay => {
            this.map.removeOverlay(overlay);
        });
        this.trackOverlayArray = [];
    }

    drawCallback(features, start, end) {

        this.trackLayer.getSource().addFeatures(features);

    }
}