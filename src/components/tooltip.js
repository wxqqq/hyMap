/*
 * @Author: wxq
 * @Date:   2017-07-03 17:36:31
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-07-04 14:48:05
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\tooltip.js
 * @File Name: tooltip.js
 * @Descript: 
 */
'use strict';

const ol = require('ol');

export default class tooltip {
    constructor(options) {

        this.overlay = this.init();

    }
    init() {

        var dom = document.createElement('div');
        dom.id = 'hy_contextmenu_' + new Date().getTime();
        document.body.appendChild(dom);
        const menu_overlay = new ol.Overlay({
            element: dom,
            positioning: 'center-center'
        });

        this.map.addOverlay(menu_overlay);
        // menu_overlay.setMap(this.map);
        return menu_overlay;

    }
    show(coords) {

        this.overlay.setPosition(coords);


    }
    hide() {

        this.menu_overlay.setPosition(undefined);

    }
}