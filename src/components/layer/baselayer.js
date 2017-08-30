/*
 * @Author: wxq
 * @Date:   2017-05-08 20:09:53
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-08-30 18:03:05
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\baselayer.js
 * @File Name: baselayer.js
 * @Descript: 
 */
'use strict';
import {
    mix
} from '../tools/mixClass';
import base from './base';
import hyMapStyle from '../style/hyMapStyle';
import {
    getFilterFeature,
    compileStyle
} from '../../core/mapbox/FeatureFilter';
const ol = require('ol');

export default class baseLayer extends mix(base, hyMapStyle) {
    /**
     * 初始化
     * @param  {Object}   options 参数
     */
    constructor(options) {

        super(options);

    }

    /**A
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
                font[2] = newFont + 'px';
                text.setFont(font.join(' '));

            }

        }

        // if (this.map.getView().getZoom() > 18 && feature.getGeometry() instanceof ol.geom.LineString) {

        //     feature.getGeometry().forEachSegment((start, end) => {

        //         const rotation = this.getAngel(start, end);
        //         const line = new ol.geom.LineString([start, end]);
        //         let style = new ol.style.Style({
        //             geometry: new ol.geom.Point(line.getCoordinateAt(0.33)),
        //             image: new ol.style.Icon({
        //                 src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAATCAMAAACTKxybAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAHJQTFRF//////8A//8A/6pV/79A/8wz/9Ur/9Eu/8Q7/8wz/9It/8k2/9Eu/8o1/9Av/8o1/84x/8wz/8wz/8wz/8wz/8wz/8s0/8wz/8s0/8wz/8wz/8wz/8wz/8s0/8wz/8wz/8wz/8wz/8wz/8wz/8wz/8wzo2lg3QAAACV0Uk5TAAECAwQFBgsNDxETFhgbHUNGm6Ckqa2usrW+w8fLztLV1tnc9jtYQ+sAAABdSURBVAjXZc9HDsAwCARAp/fee+X/X8wesIQVbiMELEqVU6B0VS8tocZARGvE8Edoi1leD+0Jy+2gI2U5LXRmLLuB7pxl1dBT6N4Fzf+OnJHb5B2ZwMhmpDb+kZ9+tBQLxwwvvoMAAAAASUVORK5CYII=',
        //                 anchor: [0.75, 0.5],
        //                 rotateWithView: true,
        //                 rotation: rotation
        //             })
        //         });

        //         let style1 = style.clone();
        //         style1.setGeometry(new ol.geom.Point(line.getCoordinateAt(0.66)));
        //         rStyle.push(style);
        //         rStyle.push(style1);

        //     });

        // }
        return rStyle;

    }
    _scaleSize(symbolSize = [], min, max) {

        let a = symbolSize[1] - symbolSize[0] + 1;
        return max / a;

    }
    getAngel(start, end) {

        var dx = end[0] - start[0];
        var dy = end[1] - start[1];
        var rotation = Math.atan2(dy, dx);
        return -rotation;

    }

    getFeatureById(id) {

        const feature = this.source.getFeatureById(id);
        return feature;

    }
    dispose() {

        this.map && this.map.removeLayer(this.layer);
        let source = this.layer.getSource();
        //聚合图层的source为两层，进行判断获取到最底层的source
        if (source instanceof ol.layer.AnimatedCluster) {

            source = source.getSource();

        }
        source.clear();
        this.source = undefined;
        this.layer = undefined;
        this.map = undefined;
    }
}