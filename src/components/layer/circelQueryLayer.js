/*
 * @Author: wxq
 * @Date:   2017-05-23 20:14:54
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-15 16:44:04
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
        this.ra = 0;
        this.moveBtnImg = 'data:image/png;base64,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';

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
                        fillColor: 'rgba(14,139,225,0.1)'
                    },
                    'emphasis': {
                        strokeColor: '#059639',
                        strokeWidth: 1
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

        translate.on('translatestart', (evt) => {


            this.map.un('postcompose', this.drawRender, this);

        });

        translate.on('translating', (evt) => {

            let fea = evt.features.getArray()[0];
            let newCoord = fea.getGeometry().getCoordinates();
            let center = fea.get('center');
            let oldCoord = fea.get('oldCoord');
            let dis = Math.abs(Math.floor(newCoord[0] - center[0]));
            if (dis > 20000) {

                dis = 20000;
                fea.setGeometry(new ol.geom.Point([center[0] + 20000, center[1]]));

            } else {

                fea.setGeometry(new ol.geom.Point([newCoord[0], center[1]]));

            }

            fea.set('distance', dis);
            this.feature.setGeometry(new ol.geom.Circle(center, dis));

        });
        translate.on('translateend', (evt) => {

            this.map.on('postcompose', this.drawRender, this);
            let geometry = this.feature.getGeometry();
            this.radius = geometry.getRadius();
            let result = this.getCircleInfo(geometry.getCenter(), this.radius);
            result.geometry = this.feature.getGeometry();
            this.queryFun && this.queryFun(result);

        });

        this.map.addInteraction(translate);
        this.feature = new ol.Feature({
            geometry: new ol.geom.Point([0, 0])
        });
        this.source.addFeature(this.feature);

        this.marker.setStyle((feature, resolution) => {

            return this.styleFun(feature, resolution);

        });
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

        let dis = fea.get('distance');

        if (dis < 3000) {

            dis += '米';

        } else {

            dis = (dis / 1000).toFixed(1) + '公里';
        }

        return new ol.style.Style({
            image: new ol.style.Icon({
                src: this.moveBtnImg,
                size: [32, 20]
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.6)'
            }),
            stroke: new ol.style.Stroke({
                color: '#319FD3',
                width: 5
            }),
            text: new ol.style.Text({
                text: dis,
                font: '14px Calibri,sans-serif',
                fill: new ol.style.Fill({
                    color: '#fff'
                }),
                // textAlign: 'right',
                offsetX: 48
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
        this.geoCoord = geoCoord;
        this.radius = radius;
        this.coords = mapTool.transform(geoCoord);
        const geometry = new ol.geom.Circle(this.coords, radius);

        this.setPosition(geometry);
        let result = this.getCircleInfo(this.coords, radius);
        result.geometry = geometry;
        this.queryFun && this.queryFun(result);
        this.map.on('postcompose', this.drawRender, this);

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
    drawRender(evt) {


        // ctx.clearRect()
        let ctx = evt.context;
        let obj = this.getCircleInfo(this.coords, this.radius);
        let piex = obj.piex_center;
        let radius = obj.piex_radius;

        var grd = ctx.createRadialGradient(piex[0], piex[1], 0, piex[0], piex[1], radius);
        grd.addColorStop(0.8, 'rgba(160,16,17,0)');
        grd.addColorStop(1, 'rgba(160,16,17,0.8)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(piex[0], piex[1], radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.moveTo(piex[0], piex[1]);
        // ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'rgba(255,0,0,0.3)';
        for (let i = 0; i < 3; i++) {

            ctx.beginPath();
            ctx.arc(piex[0], piex[1], ((radius - 1) / 3) * (i + 1), 0, Math.PI * 2, false);
            // ctx.strokeStyle = 'hsla(' + (360 - (i * (50 / 4))) + ', ' + 50 + '%, ' + 40 + '%, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();

        }

        this.drawRadar(this.ra, ctx, obj);
        this.ra++;

    }

    /**
     * [drawRadar description]
     * @author WXQ
     * @date   2017-06-15
     * @param  {[type]}   iDeg [description]
     * @param  {[type]}   ctx  [description]
     * @param  {[type]}   obj  [description]
     * @return {[type]}        [description]
     */
    drawRadar(iDeg, ctx, obj) {

        ctx.save();
        let piex = obj.piex_center;
        let radius = obj.piex_radius;
        ctx.translate(piex[0], piex[1]);
        ctx.rotate(iDeg / 90 * Math.PI);
        for (let i = 0; i < 270; i++) {

            ctx.beginPath();
            ctx.moveTo(0, 0);
            var opcial = i / 100 / 3 - 0.3;
            ctx.fillStyle = 'rgba(255,0,0,' + opcial + ')';
            ctx.arc(0, 0, radius, i / 360 * Math.PI, (i + 2) / 360 * Math.PI, false);
            ctx.closePath();
            ctx.fill();

        }
        ctx.restore();
        this.map.render();

    }
    getCircleInfo(coords, radius) {

        const geom_temp = [coords[0] + radius, coords[1]];
        const piex_center = this.map.getPixelFromCoordinate(coords);
        const piex_radius = this.map.getPixelFromCoordinate(geom_temp)[0] - piex_center[0];


        let circleObj = {
            radius: radius,
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