/*
 * @Author: wxq
 * @Date:   2017-07-26 11:22:13
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-08-01 11:43:51
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\base.js
 * @File Name: base.js
 * @Descript: 
 */
'use strict';
import events from '../../events/events';

const ol = require('ol');

export default class base {
    /**
     * 初始化
     * @param  {Object}   options 参数
     */
    constructor({
        map = undefined,
        url = undefined
    } = {}) {

        this.url = url;
        this.map = map;
        this.source;
        this.layer = undefined;

    }

    /**
     * 获取图层
     * @return {layer}   layer 图层
     */
    getLayer() {

        return this.layer;

    }

    /**
     * 获取数据
     * @return {object}   source 数据源
     */
    getSource() {

        this.layer.getSource();

    }

    /**
     * 设置数据
     * @param  {source}   source 数据源
     */
    setSource(source) {

        this.layer.setSource(source);

    }

    /**
     * 显示图层
     */
    show() {

        this.layer.setVisible(true);

    }

    /**
     * 隐藏图层
     */
    hide() {

        this.layer.setVisible(false);

    }

    setUrl(url) {

        this.url = url;

    }

    getUrl() {

        return this.url;

    }
}
Object.assign(base.prototype, events);