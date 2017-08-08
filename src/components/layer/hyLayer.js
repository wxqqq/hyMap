/*
 * @Author: wxq
 * @Date:   2017-04-20 17:02:10
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-08-07 11:20:45
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\hyLayer.js
 * @File Name: hyLayer.js
 * @Descript: 
 */
'use strict';

import baseLayer from './baselayer';
import hyFeature from '../feature/hyFeature';
import baseUtil from '../../util/baseUtil';
import colorUtil from '../../util/colorUtil';
import serieModel from '../../model/serieModel';
import mapTool from '../../util/mapToolUtil';

const ol = require('ol');
// const geojsonvt = require('geojsonvt');

export default class hylayer extends baseLayer {
    /**
     * 初始化
     * @param  {Object}   options 参数
     */
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
    update(serie) {

        let newserie = baseUtil.clone(serieModel);
        baseUtil.merge(newserie, serie, true);
        serie = newserie;
        const style = this._createFeatureStyle(serie);
        this.layer.set('fstyle', style);
        this.layer.set('serie', serie);
        const data = serie.data;
        let source = this.layer.getSource();
        //聚合图层的source为两层，进行判断获取到最底层的source
        if (source instanceof ol.layer.AnimatedCluster) {

            source = source.getSource();

        }

        let addData = [];
        let updateData = new Map();
        let strMap = new Map();

        for (let k of Object.keys(data)) {

            strMap.set('serie|' + data[k].geoCoord, data[k]);

        }
        //目标数据遍历，找到的更新，未找到的删除。
        source.forEachFeature(function(feature) {

            const geoCoord = feature.getId();
            if (strMap.has(geoCoord)) {

                const value = strMap.get(geoCoord);
                feature.setProperties(value);
                updateData.set('serie|' + value.geoCoord, value);

            } else {

                // console.info('update_rmData', feature);
                source.removeFeature(feature);

            }

        });
        //找到的数据进行更新，未找到的准备新增。

        data.map((value) => {

            if (!updateData.has(value.geoCoord)) {

                addData.push(value);

            }

        });

        //增加数据.
        if (addData.length > 0) {

            const featuresObj = hyFeature.getFeatures(addData, serie.type);
            //获取feature数组
            const array = featuresObj.features;
            this.layer.getSource().addFeatures(array);

        }

    }

    createLayer(serie, source, array) {

        let vector = null;
        if (serie.type == 'heatmap') {

            //创建热力图
            vector = new ol.layer.Heatmap({
                source: source,
                gradient: serie.heatOption && serie.heatOption.gradient || undefined,
                blur: serie.heatOption && serie.heatOption.blur || undefined,
                radius: serie.heatOption && serie.heatOption.radius || undefined,
                shadow: serie.heatOption && serie.heatOption.shadow || undefined,
                maxResolution: mapTool.getResolutionByZoom(serie.minZoom, this.view),
                minResolution: mapTool.getResolutionByZoom(serie.maxZoom, this.view)
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

                    minResolution: mapTool.getResolutionByZoom(serie.maxZoom, this.view),
                    maxResolution: mapTool.getResolutionByZoom(serie.minZoom, this.view)
                });
                clusterSource.vector = vector;

            } else if (serie.type == 'tile') {
                // var replacer = function(key, value) {
                //     if (value.geometry) {
                //         var type;
                //         var rawType = value.type;
                //         var geometry = value.geometry;

                //         if (rawType === 1) {
                //             type = 'MultiPoint';
                //             if (geometry.length == 1) {
                //                 type = 'Point';
                //                 geometry = geometry[0];
                //             }
                //         } else if (rawType === 2) {
                //             type = 'MultiLineString';
                //             if (geometry.length == 1) {
                //                 type = 'LineString';
                //                 geometry = geometry[0];
                //             }
                //         } else if (rawType === 3) {
                //             type = 'Polygon';
                //             if (geometry.length > 1) {
                //                 type = 'MultiPolygon';
                //                 geometry = [geometry];
                //             }
                //         }

                //         return {
                //             'type': 'Feature',
                //             'geometry': {
                //                 'type': type,
                //                 'coordinates': geometry
                //             },
                //             'properties': value.tags
                //         };
                //     } else {
                //         return value;
                //     }
                // };
                // let json = new ol.format.GeoJSON().writeFeaturesObject(array, {
                //     dataProjection: 'EPSG:4326',
                //     featureProjection: 'EPSG:3857'
                // });
                // let tileIndex = geojsonvt(json, {
                //     extent: 4096,
                //     debug: 0
                // });
                // // console.log(tileIndex);
                // console.log(tileIndex.getTile(1, 1, 0))
                // var tilePixels = new ol.proj.Projection({
                //     code: 'TILE_PIXELS',
                //     units: 'tile-pixels'
                // });

                // let vsource = new ol.source.VectorTile({
                //     format: new ol.format.GeoJSON(),
                //     tileGrid: ol.tilegrid.createXYZ(),
                //     tilePixelRatio: 16,
                //     tileLoadFunction: function(tile, url) {

                //         var format = tile.getFormat();
                //         var tileCoord = tile.getTileCoord();
                //         var data = tileIndex.getTile(tileCoord[0], tileCoord[1], -tileCoord[2] - 1);
                //         var features = format.readFeatures(
                //             JSON.stringify({
                //                 type: 'FeatureCollection',
                //                 features: data ? data.features : []
                //             }, replacer));
                //         tile.setLoader(function() {
                //             tile.setFeatures(features);
                //             tile.setProjection(tilePixels);
                //         });
                //     },
                //     url: 'data:' // arbitrary url, we don't use it in the tileLoadFunction
                // });
                // vector = new ol.layer.VectorTile({
                //     source: vsource,
                //     style: function(feature, projection) {

                //         return new ol.style.Style({
                //             image: new ol.style.Circle({
                //                 radius: 1,
                //                 snapToPixel: false,
                //                 fill: new ol.style.Fill({
                //                     color: 'red'
                //                 }),
                //                 stroke: new ol.style.Stroke({
                //                     color: 'red',
                //                     width: 1
                //                 })
                //             }),
                //             fill: new ol.style.Fill({
                //                 color: 'rgba(255, 255, 255, 0.6)'
                //             }),
                //             stroke: new ol.style.Stroke({
                //                 color: '#319FD3',
                //                 width: 1
                //             })
                //         })
                //     }
                // })
            } else {

                vector = new ol.layer.Vector({
                    source: source,
                    style: (feature, resolution, type) => {

                        return this._geoStyleFn(feature, resolution, type);

                    },
                    minResolution: mapTool.getResolutionByZoom(serie.maxZoom, this.view),
                    maxResolution: mapTool.getResolutionByZoom(serie.minZoom, this.view)
                });

                this.startAnimate(array, serie.animation); //执行动画

            }

        }
        return vector;
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

        let vector = this.createLayer(serie, source, array);
        const style = this._createFeatureStyle(serie);

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
     * style回调方法
     * @param  {ol.feature} feature    [description]
     * @param  {array} resolution [description]
     * @param  {String} type  样式类型     [description]
     * @return {Style}  显示的定义样式
     */
    _geoStyleFn(feature, resolution, type = 'normal') {

        const style = feature.get('style') || feature.source.vector.get('fstyle');
        const rStyle = style[type];
        const serie = feature.source.vector.get('serie');
        const symbolSize = serie && serie.symbolSize;
        const serieType = serie && serie.type;

        //判断是否对图形大小进行动态设置
        if (symbolSize && symbolSize[0] != symbolSize[1]) {

            let geoScaleNum = this._scaleSize(symbolSize, feature.source.get('minValue'), feature.source.get('maxValue'));
            let value = feature.get('value') || 0;
            //对数据进行判断，
            if (feature.source instanceof ol.source.Cluster) {

                geoScaleNum = this._scaleSize(symbolSize, feature.source.getSource().get('minValue'), feature.source.getSource().get('maxValue'));

                const features = feature.get('features');

                if (features) {

                    features.forEach((feature) => {

                        let fValue = feature.get('value');
                        if (fValue > value) {

                            value = fValue;

                        }

                    });

                } else {

                    value = feature.get('value');

                }

            }
            const scale = Math.floor(value / geoScaleNum);
            const icon = rStyle[0].getImage();
            if (icon) {

                if (icon instanceof ol.style.Icon) {

                    icon.setScale((symbolSize[0] + scale) / (symbolSize[0] / icon.relScale));

                } else {

                    icon.setRadius(scale + symbolSize[0]);

                }

            }

        }

        //判断是否需要进行文本标签显示
        const text = rStyle[1].getText();
        if (text && text.show) {

            const textSize = serie && serie.labelSize;
            const column = serie && serie.labelColumn || 'value';
            let value = '';
            let textScaleNum = this._scaleSize(textSize, feature.source.get('minValue'), feature.source.get('maxValue'));

            if (feature.source instanceof ol.source.Cluster) {

                textScaleNum = this._scaleSize(textSize, feature.source.getSource().get('minValue'), feature.source.getSource().get('maxValue'));

                const features = feature.get('features');

                if (features) {

                    features.forEach((feature) => {

                        let fValue = feature.get(column);
                        if (fValue > value) {

                            value = fValue;

                        }

                    });

                } else {

                    value = feature.get(column);

                }

            } else {

                value = feature.get(column);

            }
            text.setText(value.toString());
            if (textSize && textSize[0] != textSize[1]) {

                const font = text.getFont().split(' ');
                const value = feature.get(column);
                const scale = Math.floor(value / textScaleNum);
                const newFont = scale + textSize[0] - 1;
                font[2] = newFont + 'pt';
                text.setFont(font.join(' '));

            }

        }

        return rStyle;

    }

    /**
     * 执行动画
     * @param  {Array}   array     数据
     * @param  {Object}   options  参数
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
     * 缩放效果
     * @param  {Event}   event     事件
     * @param  {Array}   array     数据
     * @param  {Object}   options  参数
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

    /**
     * 缩放动画
     * @param  {Feature} feature      元素
     * @param  {Number} elapsedRatio  开始位置
     */
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

    /**
     * 文本缩放动画
     * @param  {Event} event  事件
     * @param  {Feature} feature feature对象
     */
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
     * @param  {Event} event 事件
     * @param  {Array} array 数组
     * @param  {Object}   options  参数
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
     * @param  {Number} elapsedRatio 起始值
     * @param  {Number} iconradius   半径
     * @param  {Number} scale       倍率
     * @param  {String} type         类型
     * @param  {String} color        颜色
     * @return {Style}               样式
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
}