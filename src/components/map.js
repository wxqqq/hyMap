/*
 * @Author: wxq
 * @Date:   2017-04-27 16:37:00
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-02 17:46:00
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\map.js
 * @File Name: map.js
 * @Descript: 
 */
'use strict';

require('../../css/ol.css');
require('../../css/layerswitcherimagecontrol.css');
require('../../css/layerswitchercontrol.css');

const ol = require('ol');

export default class map {
    constructor() {
        const map = this._createMap();
        return map;
    }

    /**
     * 创建map
     * @param  {[type]} dom [description]
     * @return {[type]}     [description]
     */
    _createMap() {

        const map = new ol.Map({
            // renderer: 'webgl',
            // target: ,
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                }),
                zoom: false
            }).extend([
                // new ol.control.LayerSwitcher({
                //     reordering: false
                // }),

                // new ol.control.LayerSwitcherImage(),

                // new ol.control.FullScreen(),
                // new ol.control.MousePosition(),//鼠标位置
                // new ol.control.OverviewMap({
                // layers: this._basicLayersArray
                // }), //鹰眼
                // new ol.control.ScaleLine({
                //     minWidth: 52,
                //     units: 'zh'
                // }),
                // new ol.control.ZoomSlider(),//地图缩放侧边栏
                // new ol.control.ZoomToExtent()//一键缩放到全图
            ]),
            logo: this.getLogo()

        });
        map.on('pointermove', function(evt) {

            evt.map.getTargetElement().style.cursor = evt.map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';

        });

        return map;

    }

    /**
     * 增加logo
     * @return {[type]} [description]
     */
    getLogo() {

        if (!this._showLogo) {

            return false;

        }

        let logoElement = document.createElement('a');
        logoElement.href = 'http://www.hydata.cc/';
        logoElement.target = '_blank';
        logoElement.className = 'ol-hy-logo';
        logoElement.innerHTML = '&copy; 2017 HYDATA';
        return logoElement;

    }
}