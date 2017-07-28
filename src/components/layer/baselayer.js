/*
 * @Author: wxq
 * @Date:   2017-05-08 20:09:53
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-07-27 16:22:29
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
const ol = require('ol');

export default class baseLayer extends mix(base, hyMapStyle) {
    /**
     * 初始化
     * @param  {Object}   options 参数
     */
    constructor(options) {

        super(options);

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
    _scaleSize(symbolSize = [], min, max) {

        let a = symbolSize[1] - symbolSize[0] + 1;
        return max / a;

    }
}