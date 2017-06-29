/*
 * @Author: wxq
 * @Date:   2017-04-20 17:02:10
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-29 11:33:02
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\hyLayer.js
 * @File Name: hyLayer.js
 * @Descript: 
 */
'use strict';
import hyMapStyle from '../style/hyMapStyle';
import hyFeature from '../feature/hyFeature';
import baseUtil from '../../util/baseUtil';
import colorUtil from '../../util/colorUtil';
import serieModel from '../../model/serieModel';
import mapTool from '../../util/mapToolUtil';

const ol = require('ol');

export default class hylayer extends hyMapStyle {
    constructor(options) {

        super(options);
        this.map = options.map;
        this.view = this.map.getView();
        this.layer = this.init(options.serie);

    }
    add() {

    }
    remove() {

    }
    update() {



    }
    getlayer() {

    }
    init(serie) {

        let newserie = baseUtil.clone(serieModel);
        baseUtil.merge(newserie, serie, true);
        serie = newserie;
        const data = serie.data;

        //获取feature对象
        const featuresObj = hyFeature.getFeatures(data, serie.type, serie.id);
        //获取feature数组
        const array = featuresObj.features;
        //获取比例缩放的像素最小值，最大值
        const source = new ol.source.Vector();
        source.set('maxValue', featuresObj.max);
        source.set('minValue', featuresObj.min);
        source.set('data', serie.data);
        source.on('addfeature', (evt) => {

            evt.feature.source = evt.target;
            if (evt.feature.get('value')) {

                this.changeScaleNum(evt.feature.get('value'), evt.target);

            }

            if (serie.labelAnimate && (serie.labelAnimate.enable == true || serie.labelAnimate.enable === 'true')) {

                evt.feature.period = serie.labelAnimate.period;
                evt.feature.on('propertychange', (evt) => {

                    let fea = evt.target;
                    if (evt.key == 'value') {

                        this.changeScaleNum(fea.get('value'), fea.source);

                        if (!fea.textListenerKey) {

                            fea._intervaldate = new Date().getTime();
                            fea.textListenerKey = this.map.on('postcompose', (evt) => {

                                this.textScale(evt, fea);

                            });

                        }

                    }

                });

            }

        });



        let vector = null;
        const style = this._createFeatureStyle(serie);

        if (serie.type == 'heatmap') {

            //创建热力图
            vector = new ol.layer.Heatmap({
                source: source,
                gradient: serie.heatOption && serie.heatOption.gradient || undefined,
                blur: serie.heatOption && serie.heatOption.blur || undefined,
                radius: serie.heatOption && serie.heatOption.radius || undefined,
                shadow: serie.heatOption && serie.heatOption.shadow || undefined,
                maxResolution: mapTool.getProjectionByZoom(serie.minZoom, this.view),
                minResolution: mapTool.getProjectionByZoom(serie.maxZoom, this.view)
            });

        } else {

            //创建聚合图层
            if (serie.cluster && (serie.cluster.enable == true || serie.cluster.enable === 'true')) {

                let clusterSource = new ol.source.Cluster({
                    distance: serie.cluster.distance || 20,
                    source: source
                });
                clusterSource.on('addfeature', function(evt) {

                    evt.feature.source = evt.target;

                });
                vector = new ol.layer.AnimatedCluster({
                    source: clusterSource,
                    style: (feature, resolution, type) => {

                        return this._geoStyleFn(feature, resolution, type);

                    },

                    minResolution: mapTool.getProjectionByZoom(serie.maxZoom, this.view),
                    maxResolution: mapTool.getProjectionByZoom(serie.minZoom, this.view)
                });
                clusterSource.vector = vector;

            } else {

                vector = new ol.layer.Vector({
                    source: source,
                    style: (feature, resolution, type) => {

                        return this._geoStyleFn(feature, resolution, type);

                    },

                    minResolution: mapTool.getProjectionByZoom(serie.maxZoom, this.view),
                    maxResolution: mapTool.getProjectionByZoom(serie.minZoom, this.view)
                });

                this.startAnimate(array, serie.animation); //执行动画

            }

        }
        vector.set('name', serie.name || new Date().getTime());
        vector.set('serie', serie);
        vector.set('interior', serie.interior);
        vector.set('type', 'item');
        vector.set('id', serie.id || new Date().getTime());
        vector.set('contextmenu', serie.contextmenu);
        // vector.set('showPopup', serie.showPopup);
        vector.set('fstyle', style);

        source.vector = vector;
        source.on('addfeature', (evt) => {
            // setTimeout(() => {
            // evt.target.vector.animateFeature(evt.feature, [new ol.featureAnimation.Zoom({
            //     speed: 0.1,
            //     duration: 600,
            //     side: 'Zoom'
            // })]);

            // }, 2000)
        });
        source.addFeatures(array);
        //      array.forEach((fea)=>{
        //          window.setTimeout(()=>{
        //      source.addFeature(fea);
        //        vector.animateFeature(fea, [new ol.featureAnimation.Zoom({
        //             speed: 0.2,
        //             duration: 3000,
        //             side: 'Zoom',
        //         })]);
        //          },2000)
        // })



        return vector;



    }

    /**
     * 执行动画
     * @author WXQ
     * @date   2017-04-13
     * @param  {[type]}   array     [description]
     * @param  {[type]}   options [description]
     * @return {[type]}             [description]
     */
    startAnimate(array, options) {

        if (options && options.enable) {

            const animationThreshold = options.animationThreshold || 1000;
            if (array.length > animationThreshold) {

                return;

            }

            options._intervaldate = new Date().getTime();
            if (options.effectType == 'ripple') {

                this.map.on('postcompose', (evt) => {

                    this.animationRipple(evt, array, options);

                });

            } else {

                this.map.on('postcompose', (evt) => {

                    this.animateFlights(evt, array, options);

                });

            }

        }

    }

    /**
     * [animateFlights description]
     * @author WXQ
     * @date   2017-04-13
     * @param  {[type]}   event     [description]
     * @param  {[type]}   array     [description]
     * @param  {[type]}   options [description]
     * @return {[type]}             [description]
     */
    animateFlights(event, array, options) {

        const duration = options.period * 1000;
        let elapsed = event.frameState.time - options._intervaldate;
        if (elapsed > duration) {

            options._intervaldate = event.frameState.time;
            elapsed = 0;

        }
        let elapsedRatio = elapsed / duration;

        for (let i = 0; i < array.length; i++) {

            this.animateScale(array[i], elapsedRatio);

        }

    }

    animateScale(feature, elapsedRatio) {

        let style = this.getFeatureStyle(feature);
        let image = style[0].getImage();
        image.setScale(ol.easing.upAndDown(elapsedRatio) + 1);
        image.setOpacity(ol.easing.upAndDown(elapsedRatio) + 0.6);
        feature.setStyle(style);

    }

    animateText(feature, elapsedRatio) {

        let old_style = this.getFeatureStyle(feature);
        let style = [old_style[0].clone(), old_style[1].clone()];
        let text = style[1].getText();
        text.setScale(ol.easing.upAndDown(elapsedRatio) * 1 + 1);
        feature.setStyle(style);

    }

    textScale(event, feature) {

        const duration = feature.period * 1000 || 700;
        let time = event.frameState ? event.frameState.time : new Date().getTime();
        let elapsed = time - feature._intervaldate;

        if (elapsed > duration) {

            feature.setStyle();
            this.map.un('postcompose', feature.textListenerKey.listener);
            feature.textListenerKey = undefined;
            return;

        } else {

            let elapsedRatio = elapsed / duration;
            this.animateText(feature, elapsedRatio);

        }


    }

    /**
     * 涟漪动画
     * @param  {[type]} event [description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    animationRipple(event, array, options) {

        const duration = options.period * 1000;
        let vectorContext = event.vectorContext;
        let elapsed = event.frameState.time - options._intervaldate;
        //当时间超过周期2倍时，修改start为当前-周期。保证循环播放能够顺序进行。
        if (elapsed > duration * 2) {

            options._intervaldate = new Date().getTime() - duration;
            elapsed = event.frameState.time - options._intervaldate;

        }
        //获取涟漪生产的间隔。
        const step = Math.ceil((elapsed / duration * 3));
        let elapsedRatio = elapsed / duration;


        for (let i = 0; i < array.length; i++) {

            let feature = array[i];
            let style = this.getFeatureStyle(feature);

            const styleObj = style[0]; //0位置为图标。1为文本
            const icon = styleObj.getImage();
            const radius = (icon instanceof ol.style.Icon) ? icon.getImageSize()[0] / 2 : icon.getRadius();
            const color = (icon instanceof ol.style.Icon) ? undefined : icon.getFill().getColor();
            const flashGeom1 = feature.clone();
            const style1 = this._createAnimationStyle(elapsedRatio, radius, options.scale, options.brushType, color);
            vectorContext.drawFeature(flashGeom1, style1);
            //根据间隔进行多个圈的绘制。模拟多次扩展效果
            for (let n = 0; n < step; n++) {

                let flashGeom = feature.clone();
                const elapsed1 = elapsed - n * duration / 3;
                const elapseRatio1 = elapsed1 / duration;
                if (elapsed1 > 0) {

                    const style = this._createAnimationStyle(elapseRatio1, radius, options.scale, options.brushType, color);
                    vectorContext.drawFeature(flashGeom, style);

                }

            }

        }

        this.map.render();

    }



    /**
     * 涟漪动画样式设置
     * @param  {[type]} elapsedRatio [description]
     * @param  {[type]} iconradius   [description]
     * @param  {Number} scale        [description]
     * @param  {String} type         [description]
     * @return {[type]}              [description]
     */
    _createAnimationStyle(elapsedRatio, iconradius, scale = 2.5, type = 'stroke', color = 'rgba(140,0,140,1)') {

        let opacity = ol.easing.easeOut(1 - elapsedRatio) - 0.2;
        const radius = ol.easing.easeOut(elapsedRatio) * (scale - 1) * iconradius + iconradius;
        let image;
        if (color.indexOf('rgb') > -1) {

            if (color.indexOf('rgba') > -1) {

                color = colorUtil.rgbaToRgb(color);

            }
            color = colorUtil.colorHex(color);

        }

        const colorRgba = colorUtil.hexToRgba(color, opacity);

        if (type == 'stroke') {

            image = new ol.style.Circle({
                radius: radius,
                snapToPixel: false,
                stroke: new ol.style.Stroke({
                    color: colorRgba,
                    width: 0.25 + opacity
                })
            });

        } else {

            image = new ol.style.Circle({
                radius: radius,
                snapToPixel: false,
                fill: new ol.style.Fill({
                    color: colorRgba

                })
            });

        }
        return new ol.style.Style({
            image: image
        });

    }
    changeScaleNum(value, source) {

        const max = source.get('maxValue');
        const min = source.get('minValue');
        if (value > max) {

            source.set('maxValue', value);
            return;

        }
        if (value < min) {

            source.set('minValue', value);

        }

    }
    dispose() {

        this.map.reomve(this.layer);

    }
    update(serie) {



    }
}