/*
 * @Author: wxq
 * @Date:   2017-05-22 13:37:27
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-05-31 15:17:38
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\trackLayer.js
 * @File Name: trackLayer.js
 * @Descript: 
 */
'use strict';
import baseLayer from './baselayer';

const ol = require('ol');

export default class trackLayer extends baseLayer {
    constructor(options) {

        super(options);
        this.map = options.map;
        this.animating = false;
        this.trackStyles = {
            'route': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 6,
                    color: [237, 212, 0, 0.8]
                })
            }),
            'icon': new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: 'img/local_over.png'
                })
            }),
            'geoMarker': new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 0.5],
                    src: 'img/car.png',
                    rotation: Math.PI / 180 * 90
                })
            })
        };

        this.trackLayer = new ol.layer.Vector({
            source: new ol.source.Vector({}),
            style: (feature) => {

                // hide geoMarker if animation is active
                if (this.animating && feature.get('type') === 'geoMarker') {

                    return null;

                }
                return this.trackStyles[feature.get('type')];

            }
        });
        this.map.addLayer(this.trackLayer);

    }

    clearTrack() {

        var source = this.trackLayer.getSource();
        source.clear();

    }

    initTrackData(polyline) {

        this.clearTrack();
        var source = this.trackLayer.getSource();
        var route = new ol.format.Polyline({
            factor: 1e6
        }).readGeometry(polyline, {
            dataProjection: 'EPSG:4326',
            featureProjection: this.map.getView().getProjection().getCode()
        });

        this.routeCoords = route.getCoordinates();
        this.routeLength = this.routeCoords.length;
        this.routeFeature = new ol.Feature({
            type: 'route',
            geometry: route
        });
        this.geoMarker = new ol.Feature({
            type: 'geoMarker',
            geometry: new ol.geom.Point(this.routeCoords[0])
        });
        this.startMarker = new ol.Feature({
            type: 'icon',
            geometry: new ol.geom.Point(this.routeCoords[0])
        });
        this.endMarker = new ol.Feature({
            type: 'icon',
            geometry: new ol.geom.Point(this.routeCoords[this.routeLength - 1])
        });
        source.addFeatures([this.routeFeature, this.startMarker, this.endMarker, this.geoMarker]);

    }

    moveFeature(event) {

        var frameState = event.frameState;
        if (this.animating) {

            var elapsedTime = frameState.time - this.geoMarker.tmpDate;
            //增加延迟处理，当前事件达到speed*1000后执行下1个轨迹点移动
            var index = this.geoMarker.now;
            if (index >= this.routeLength) {

                this.geoMarker.now = 0;
                index = 0;
                // this.stopAnimation('stop');
                // return;

            }
            var start = this.routeCoords[index - 1];

            var end = this.routeCoords[index];

            if (!start) {
                start = end;

            }
            //获取前后两点之间的线，进行线性绘制点。保证播放的平滑。
            var frofun = ol.easing.linear(elapsedTime / 1000);
            var lineString = new ol.geom.LineString([start, end]);
            var poi = lineString.getCoordinateAt(frofun);
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);
            this.trackStyles.geoMarker.getImage().setRotation(-rotation);
            //设置当前gps点位置
            var currentPoint = new ol.geom.Point(poi);
            this.geoMarker.setGeometry(currentPoint);

            if ((elapsedTime > 1000 / this.geoMarker.speed) || index == 0) {
                this.geoMarker.tmpDate = new Date().getTime();
                this.geoMarker.now++;
                //判断方向

            }
        }
        // tell OpenLayers to continue the postcompose animation
        this.map.render();

    }

    setSpeed(speed) {

        this.geoMarker.speed = Number(speed) || 1;

    }
    startAnimation(speed) {

        if (this.trackLayer.getSource().getFeatures() == 0) {

            return;

        }
        if (this.animating) {

            this.stopAnimation('stop');

        } else {

            this.animating = true;
            this.geoMarker.now = 0;
            this.geoMarker.tmpDate = new Date().getTime();
            this.geoMarker.speed = speed || 1;
            this.geoMarker.setStyle(null);
            this.map.on('postcompose', this.moveFeature, this);
            this.map.render();

        }

    }

    stopAnimation(flag) {

        if (this.trackLayer.getSource().getFeatures() == 0) {

            return;

        }
        if (flag == 'stop') {

            this.animating = false;
            this.geoMarker.now = 0;
            this.geoMarker.getGeometry().setCoordinates(this.routeCoords[0]);
            this.map.un('postcompose', this.moveFeature, this);

        } else if (flag == 'pause') {

            this.map.un('postcompose', this.moveFeature, this);


        } else if (flag == 'containue') {

            // this.animating = true;
            this.geoMarker.tmpDate = new Date().getTime();
            this.map.on('postcompose', this.moveFeature, this);
            this.map.render();

        }

    }
}