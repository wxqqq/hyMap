/*
 * @Author: wxq
 * @Date:   2017-05-08 20:09:53
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-22 15:52:04
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\baselayer.js
 * @File Name: baselayer.js
 * @Descript: 
 */
'use strict';

import events from '../../events/events';
export default class baseLayer {
    constructor(options) {

        this.layer = undefined;

    }
    getLayer() {

        return this.layer;

    }
    getSource() {

        this.layer.getSource();

    }
    setSource(source) {

        this.layer.setSource(source);

    }
    show() {

        this.layer.setVisible(true);

    }
    hide() {

        this.layer.setVisible(false);

    }
}
Object.assign(baseLayer.prototype, events);