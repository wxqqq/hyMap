/*
 * @Author: wxq
 * @Date:   2017-04-27 16:37:00
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-29 16:25:56
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\map.js
 * @File Name: map.js
 * @Descript: 
 */
'use strict';
import events from '../events/events';

require('../../css/ol.css');
require('../../css/layerswitcherimagecontrol.css');
require('../../css/layerswitchercontrol.css');

const ol = require('ol');

export default class map {
    constructor(dom) {

        this.map = this._createMap(dom);
        this.menu_overlay = this.initMenuOverLay();
        return this.map;

    }

    /**
     * 创建map
     * @param  {[type]} dom [description]
     * @return {[type]}     [description]
     */
    _createMap(dom) {

        const map = new ol.Map({
            // renderer: 'webgl',
            target: dom,
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
                // new ol.control.MousePosition(), //鼠标位置
                // new ol.control.OverviewMap({
                // layers: this._basicLayersArray
                // }), //鹰眼
                new ol.control.ScaleLine({
                    minWidth: 52,
                    // units: 'zh'
                }),
                // new ol.control.ZoomSlider(), //地图缩放侧边栏
                // new ol.control.ZoomToExtent()//一键缩放到全图
            ]),
            logo: this.getLogo()

        });
        this.addClass(dom, 'ol-grab');
        //增加鼠标样式
        dom.addEventListener('mousedown', () => {

            this.removeClass(this.map.getTargetElement(), 'ol-grab');
            this.addClass(this.map.getTargetElement(), 'ol-grabbing');

        });
        dom.addEventListener('mouseup', () => {

            this.addClass(this.map.getTargetElement(), 'ol-grab');
            this.removeClass(this.map.getTargetElement(), 'ol-grabbing');

        });

        map.on('pointermove', function(evt) {

            evt.map.getTargetElement().style.cursor = evt.map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';

        });


        // map.on('pointerdrag', function(evt) {

        // if (!evt.map.getTargetElement().className != 'ol-grabbing') {
        // evt.map.getTargetElement().className = 'ol-grabbing';
        // }

        // evt.map.getTargetElement().style.cursor = evt.map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';

        // });
        // map.on('moveend', function(evt) {
        // evt.map.getTargetElement().firstChild.className = 'ol-grab';
        //         // evt.map.getTargetElement().style.cursor = evt.map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';

        // });
        map.on('singleclick', (evt) => {

            this.hideOverlay();

        });
        this.setContextMenu(dom);
        return map;

    }

    setContextMenu(dom) {

        dom.oncontextmenu = (event) => {

            var pixel = this.map.getEventPixel(event); //获取鼠标当前像素点
            var hit = this.map.hasFeatureAtPixel(pixel); //通过像素点判断当前鼠标上是否有图形 
            var coordinate = this.map.getEventCoordinate(event); //获取鼠标坐标
            let features = [];

            this.map.forEachFeatureAtPixel(pixel, (feature, layer) => {
                if (layer.get('contextmenu')) {
                    features.push(feature);
                }

            });

            if (hit && features.length > 0) {

                let dom = this.addOverlay(coordinate);
                this.dispatchEvent({
                    evt: event,
                    type: 'contextmenu',
                    coordinate,
                    dom: this.menu_overlay.getElement(),
                    features: features
                });
                event.preventDefault(); //取消右键默认行为

            }

        };

    }

    initMenuOverLay() {
        var dom = document.createElement('div');
        dom.id = 'hy_contextmenu_' + new Date().getTime();
        var menu_overlay = new ol.Overlay({
            element: dom,
            positioning: 'center-center'
        });
        menu_overlay.setMap(this.map);
        return menu_overlay;
    }

    addOverlay(coordinate) {

        this.menu_overlay.setPosition(coordinate);

    }
    hideOverlay() {
        this.menu_overlay.setPosition(undefined);
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
    hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    addClass(obj, cls) {
        if (!this.hasClass(obj, cls)) obj.className += " " + cls;
    }

    removeClass(obj, cls) {
        if (this.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    }
}

Object.assign(map.prototype, events);