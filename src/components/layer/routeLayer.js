/*
 * @Author: wxq
 * @Date:   2017-04-26 17:13:23
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-09-28 15:01:59
 */

'use strict';
import baseUtil from '../../util/baseUtil';
import mapTool from '../../util/mapToolUtil';
import hyLayerGroup from '../hyLayerGroup';
import baseLayer from './baselayer';

const ol = require('ol');

export default class routeLayer extends baseLayer {
    /**
     *初始化
     * @private
     * @param  {Object} options 参数
     */
    constructor(options) {

        super(options);
        this.minLength = 10e6;
        this.trackOverlayArray = [];
        this.url = 'http://192.168.11.50:8080/geoserver/hygis/wfs?sversion=1.0.0&request=GetFeature&outputFormat=application%2Fjson';
        this.tooltipFun = () => undefined;
        this.init();
        this.initLabel();

    }


    init() {

        this.source = new ol.source.Vector();
        this.source.on('addfeature', evt => {

            evt.feature.source = evt.target;

        });
        this.layer = new ol.layer.Vector({
            source: this.source,
            style: (feature, resolution) => {

                return this.styleFun(feature, resolution);

            },
            interior: true,
            type: 'item'
        });
        this.source.vector = this.layer;
        this.map.addLayer(this.layer);

    }

    initLabel() {

        let width = 70;
        let height = 20;
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');

        var grd = ctx.createLinearGradient(0, height, width, height);
        grd.addColorStop(0, 'red');
        grd.addColorStop(1, 'yellow');

        ctx.fillStyle = grd;
        ctx.roundRect(0, 0, width, height, 5);
        ctx.fill();

        this.shortIcon = new ol.style.Icon({
            img: c,
            imgSize: [width, height]
        });

        var d = document.createElement('canvas');
        var ctxd = d.getContext('2d');

        ctxd.strokeStyle = '#fff';
        ctxd.fillStyle = '#000';
        ctxd.roundRect(0, 0, width, height, 5);
        ctxd.fill();
        ctxd.stroke();
        this.icon = new ol.style.Icon({
            img: d,
            imgSize: [width, height]
        });

    }

    styleFun(feature, resolution, type) {

        // ctx.fillRect(0, 0, width, height);
        let length = feature.get('length');
        let icon = this.icon;
        let lineDash = [10, 4];
        let color = 'yellow';
        if (length == this.minLength) {

            icon = this.shortIcon;
            color = '#40dacb';
            lineDash = [];

        }
        let styles = [new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 3,
                color: color,
                lineDash: lineDash
            })
        })];

        let geometry = feature.getGeometry();
        let point = geometry.getCoordinateAt(0.1);
        let pointStyle = new ol.style.Style({
            geometry: new ol.geom.Point(point),
            image: icon,
            text: new ol.style.Text({
                font: '12px Calibri,sans-serif',
                text: '预计' + feature.get('time') + '分钟',
                fill: new ol.style.Fill({
                    color: '#fff'
                })
            })
        });

        styles.push(pointStyle);

        return styles;
        //  return new ol.style.Style({
        //     image: new ol.style.Icon({
        //         src: this.carImg,
        //         size: [60, 60],
        //         // scale: 0.5,
        //         rotation: -rotation
        //     })
        // });

    }

    /**
     * 清空轨迹线
     */
    clearLayer() {

        this.layer.getSource().clear();

    }

    createOverlay(coordinate, str = '') {

        let overlay = this._createOverlay();


    }

    _createTrackOverLay(coordinate, content, isCustom) {

        // let overlay = baseUtil.clone(this.trackOverlay);
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
        this.minLength = 10e6;

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
            dataUrl,
            callback = undefined,
            tooltipFun = undefined,
            isCustom = false,
            tbname = 'road_jining'
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
            'tbname:' + '\'' + tbname + '\'',
            'x1:' + start[0],
            'y1:' + start[1],
            'x2:' + end[0],
            'y2:' + end[1]
        ];
        let url = this.url +
            '/hygis/wfs?sversion=1.0.0&request=GetFeature&outputFormat=application%2Fjson';
        url += '&typeName=' + 'Route' + '&viewparams=' + viewparams.join(';');
        if (dataUrl) {

            url = dataUrl; //tjc修改

        }
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
            const geometry = features[0].getGeometry().clone();
            const length = geometry.getLength() ? geometry.getLength() : feature.get('length'); //; //tjc 修改

            features[0].set('length', length);
            this.minLength = length < this.minLength ? length : this.minLength;
            const time = Math.ceil(length / 1000 * 60 / 60);
            features[0].set('time', time);
            this.layer.getSource().addFeatures(features);

            if (tooltipFun) {

                tooltipFun({
                    length,
                    time
                });

            }

        }).catch((e) => {

            if (tooltipFun) {

                tooltipFun({
                    length: Math.random() * 100 + 1000, //0,
                    time: Math.random() * 100
                });
                console.info(e);
            
            }

        });
    
    }

    clearTrackInfo() {

        //清空轨迹线
        this.layer.getSource().clear();
        //清空轨迹tooltip
        this.trackOverlayArray.forEach(overlay => {

            this.map.removeOverlay(overlay);
        
        });
        this.trackOverlayArray = [];
    
    }

    drawCallback(features, start, end) {

        this.layer.getSource().addFeatures(features);

    }
}

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {

    var min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    // 开始绘制
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;

};