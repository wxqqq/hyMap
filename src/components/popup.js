/*
 * @Author: wxq
 * @Date:   2017-07-19 15:36:21
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-07-19 16:17:27
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\popup.js
 * @File Name: popup.js
 * @Descript: 
 */
'use strict';
const ol = require('ol');

export default class hyPopup {
    /**
     * 初始化
     * @param  {Object} options 参数
     */
    constructor(options) {

    }

    /**
     * [setTooltip description]
     * @param {[type]} options [description]
     */
    setTooltip({
        show = false,
        formatter = undefined,
        trigger = undefined,
        enterable = false,
        offset = [0, 0],
        style = undefined,
        triggeron = ''
    } = {}) {

        this.tooltipShow = show;
        this.formatter = formatter;
        this.tooltipOffset = offset;
        this.tooltipTrigger = trigger;
        this.tooltipTriggeron = triggeron;
        this.enterable = enterable;
        this.setTooltipStyle(style);
        this.setTooltipOffset(this.tooltipOffset);

    }


    setTooltipStyle(styleObject) {

        // const reg = new RegExp(/^\{(.*)\}$/);
        // const reg1 = new RegExp(/\"/g);
        // const reg2 = new RegExp(/\,/g);
        // const styleStr = JSON.stringify(styleObject).replace(reg, '$1').replace(reg1, "").replace(reg2, ';');
        let styleStr = '';
        for (const i in styleObject) {

            styleStr += i + ':' + (isNaN(styleObject[i]) ? styleObject[i] : styleObject[i] + 'px') + ';';

        }

        this.tooltipOverLay.getElement().setAttribute('style', styleStr);

    }

    getToolip() {

        return this.tooltipOverLay;

    }

    setPopupStyle() {

    }

    setTooltipOffset(offset) {

        this.tooltipOverLay.setOffset(offset);

    }

    /**
     * 创建popup
     * @return {Element} [description]
     */
    _createPopup() {

        let container = document.createElement('div');
        container.id = 'popup';
        container.className = 'ol-popup';
        let closer = document.createElement('div');
        closer.id = 'popup-closer';
        closer.className = 'ol-popup-closer';
        container.appendChild(closer);
        let content = document.createElement('div');
        content.id = 'hy-popup-content';
        container.appendChild(content);
        document.body.appendChild(container);
        closer.onclick = () => {

            this.clickSelect.getFeatures().remove(this.tooltipOverLay.feature);
            this.hideToolTip();
            closer.blur();
            return false;

        };


        container.addEventListener('click', (e) => {

            this.dispatchEvent({
                evt: e,
                type: 'tooltipClick',
                // data: properties,
                // feature: unSelFeatures
                select: e.target
            });

        });

        return container;

    }

    /**
     * 显示弹出框
     * @param  {Feature} feature [description]
     */
    showToolTip(feature) {

        this.tooltipOverLay.feature = feature;
        const geometry = feature.getGeometry();
        const type = geometry.getType();

        const coordinate = type == 'Polygon' ? geometry.getInteriorPoint().getCoordinates() : geometry.getCoordinates();
        this.tooltipOverLay.setPosition(coordinate);

    }

    /**
     * 隐藏提示框
     */
    hideToolTip() {

        this.tooltipOverLay.setPosition(undefined);
        this.tooltipOverLay.set('trigger', undefined);

    }

    /**
     * 创建popup
     * @private
     * @param  {Elemnt} element [description]
     * @return {Overlay}         [description]
     */
    _createOverlay(element) {

        element = element || this._createPopup();
        let overlay = new ol.Overlay({
            id: 'hy-overly-popup',
            stopEvent: false,
            element: element,
            positioning: 'bottom-center',
            offset: [0, -20],
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });
        this.map.addOverlay(overlay);
        return overlay;

    }

    /**
     * 移除
     * @param   {Overlay} overlay [description]
     * @private
     */
    _reomoveOverlay(overlay) {

        this.map.removeOverlay(overlay);

    }

    /**
     * 全部移除
     * @private
     */
    _removeMarkerOverlay() {

        this._markerLayer.forEach((obj) => {

            this._reomoveOverlay(obj);

        });

    }
}