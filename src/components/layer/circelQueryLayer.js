/*
 * @Author: wxq
 * @Date:   2017-05-23 20:14:54
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-07 10:18:29
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\circelQueryLayer.js
 * @File Name: circelQueryLayer.js
 * @Descript: 
 */
'use strict';
import baseLayer from './baselayer';
import hyLayerGroup from '../hyLayerGroup';
import mapTool from '../../util/mapToolUtil';

const ol = require('ol');

export default class circelQueryLayer extends baseLayer {
    constructor(options) {

        super(options);
        this.map = options.map;
        this.init();

    }

    /**
     * 组件初始化
     * @author WXQ
     * @date   2017-05-24
     * @return {[type]}   [description]
     */
    init() {

        this.initLayer();
        this.initTranslate();

    }

    /**
     * 初始化周边查询层
     * @author WXQ
     * @date   2017-05-24
     * @return {[type]}   [description]
     */
    initLayer() {

        let group = new hyLayerGroup({
            map: this.map,
            series: [{
                interior: true,
                symbolStyle: {
                    'normal': {
                        // strokeWidth: 3,
                        fillColor: 'rgba(14,139,225,0.2)'
                    },
                    'emphasis': {
                        strokeColor: '#2dbc60',
                        strokeWidth: 2
                    }
                }
            }]

        });
        this.layer = group.layerGroup.getLayers().getArray()[0];
        this.source = this.layer.getSource();
        this.map.addLayer(this.layer);
        return this.layer;

    }

    /**
     * 初始化拖动控制
     * @author WXQ
     * @date   2017-05-24
     * @return {[type]}   [description]
     */
    initTranslate() {

        this.marker = new ol.Feature();
        let translate = new ol.interaction.Translate({
            hitTolerance: 5,
            features: new ol.Collection([this.marker])
        });

        translate.on('translating', (evt) => {

            let fea = evt.features.getArray()[0];
            let newCoord = fea.getGeometry().getCoordinates();
            let oldCoord = fea.get('oldCoord');
            let center = fea.get('center');
            let dis = Math.abs(Math.floor(newCoord[0] - center[0]));
            fea.set('distance', dis);
            fea.setGeometry(new ol.geom.Point([newCoord[0], oldCoord[1]]));
            this.feature.setGeometry(new ol.geom.Circle(center, dis));

        });
        translate.on('translateend', (evt) => {

            let geometry = this.feature.getGeometry();
            let result = this.getCircleInfo(geometry.getCenter(), geometry.getRadius());
            result.geometry = this.feature.getGeometry();

            this.queryFun && this.queryFun(result);

        });

        this.map.addInteraction(translate);
        this.feature = new ol.Feature({
            geometry: new ol.geom.Point([0, 0])
        });
        this.source.addFeature(this.feature);

        this.marker.setStyle(this.styleFun);
        this.source.addFeature(this.marker);

    }

    /**
     * 移动标识样式
     * @author WXQ
     * @date   2017-05-24
     * @param  {[type]}   fea        [description]
     * @param  {[type]}   resolution [description]
     * @return {[type]}              [description]
     */
    styleFun(fea, resolution) {

        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.6)'
            }),
            stroke: new ol.style.Stroke({
                color: '#319FD3',
                width: 5
            }),
            text: new ol.style.Text({
                text: fea.get('distance') + '米',
                font: '14px Calibri,sans-serif',
                fill: new ol.style.Fill({
                    color: '#fff'
                })

            })
        });

    }

    /**
     * //添加圆和可拖动标识
     * @author WXQ
     * @date   2017-05-24
     * @param  {[type]}   geometry [description]
     * @return {[type]}            [description]
     */
    load(geoCoord, radius) {

        this.clear();
        const coords = mapTool.transform(geoCoord);
        const geometry = new ol.geom.Circle(coords, radius);

        this.setPosition(geometry);
        let result = this.getCircleInfo(coords, radius);
        result.geometry = geometry;
        this.queryFun && this.queryFun(result);

        return result;

    }

    setPosition(geometry) {

        const circle = ol.geom.Polygon.fromCircle(geometry, 36);
        this.feature.setGeometry(geometry);
        //拖动标识的位置
        let markerCoord = circle.getCoordinates()[0][0];
        this.marker.setGeometry(new ol.geom.Point(markerCoord));
        this.marker.set('distance', Math.abs(Math.floor(geometry.getRadius())));
        this.marker.set('oldCoord', markerCoord);
        this.marker.set('center', geometry.getCenter());

    }

    getCircleInfo(coords, radius) {

        const geom_temp = [coords[0] + radius, coords[1]];
        const piex_center = this.map.getPixelFromCoordinate(coords);
        const piex_radius = this.map.getPixelFromCoordinate(geom_temp)[0] - piex_center[0];


        let circleObj = {
            center: coords,
            piex_center,
            piex_radius
        };
        return circleObj;

    }

    setQueryFun(fun) {

        if (fun) {

            this.queryFun = fun;

        }

    }

    /**
     * [clear description]
     * @author WXQ
     * @date   2017-05-24
     * @return {[type]}   [description]
     */
    clear() {

        this.feature.setGeometry();
        this.marker.setGeometry();

    }
    createDraw(value, fun) {

        this.clear();
        if (fun) {

            this.setQueryFun(fun);

        }
        var geometryFunction, maxPoints;
        if (value === 'Square') {

            value = 'Circle';
            geometryFunction = ol.interaction.Draw.createRegularPolygon(4);

        } else if (value === 'Box') {

            value = 'LineString';
            maxPoints = 2;
            geometryFunction = function(coordinates, geometry) {

                if (!geometry) {

                    geometry = new ol.geom.Polygon(null);

                }
                var start = coordinates[0];
                var end = coordinates[1];
                geometry.setCoordinates([
                    [start, [start[0], end[1]], end, [end[0], start[1]], start]
                ]);
                return geometry;

            };

        }

        this.draw = new ol.interaction.Draw({
            // source: this.source,
            type: value,
            geometryFunction: geometryFunction,
            maxPoints: maxPoints
        });
        // var selectedFeatures = this.clickSelect.getFeatures();
        this.draw.on('drawstart', (evt) => {

            console.log(evt);
            this.setClickActive(false);
            // selectedFeatures.clear();

        });

        this.draw.on('drawend', (evt) => {

            let geometry = evt.feature.getGeometry();

            this.setPosition(evt.feature.getGeometry());

            let coords = geometry.getCenter();
            let radius = Math.abs(Math.floor(geometry.getRadius()));
            let result = this.getCircleInfo(coords, radius);
            result.geometry = geometry;
            this.queryFun && this.queryFun(result);

            evt.stopPropagation();

            //延迟移除避免事件冲突
            window.setTimeout(() => {

                this.draw.setActive(false);
                this.removeDraw();

            }, 10);
            window.setTimeout(() => {

                this.setClickActive(true);

            }, 300);

        });
        this.map.addInteraction(this.draw);

        return this.draw;

    }

    setClickActive(flag) {

        let a = this.map.getInteractions();
        a.forEach((interaction) => {

            (interaction instanceof ol.interaction.Select) && interaction.setActive(flag);

        });

    }

    removeDraw() {

        this.map.removeInteraction(this.draw);

    }

}