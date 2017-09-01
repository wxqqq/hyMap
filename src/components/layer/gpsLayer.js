/*
 * @Author: wxq
 * @Date:   2017-04-26 21:06:23
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-09-01 15:32:40
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\gpsLayer.js
 * @File Name: gpsLayer.js
 * @Descript: 
 */
'use strict';
import baseLayer from './baselayer';
import mapTool from '../../util/mapToolUtil';

const ol = require('ol');

export default class gpsLayer extends baseLayer {
    /**
     * 初始化
     * @param  {Object}   options 参数
     * @extends hylayer
     */
    constructor(options) {

        // layeranimate 增加，移除，更新
        // track 动画，回放
        // event tooltipshow tooltiphide
        super(options);
        this.layer;
        this.source;
        this.data;
        this.carImg = options.carImg || 'data:image/png;base64,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';
        this.rotation = options.rotation;
        this.init();

    }

    /**
     * 加载
     * @return {Object}   layer layer
     */
    init() {

        this.source = new ol.source.Vector();
        this.layer = new ol.layer.Vector({
            source: this.source,
            style: (feature, resolution) => {

                return this.styleFun(feature, resolution);

            }
        });
        // this.connect();
        this.map.addLayer(this.layer);
        return this.layer;

    }

    /**
     * 样式回调
     * @param  {feature} feature    feature对象
     * @param  {String} resolution  分辨率
     * @return {Object} style           样式
     */
    styleFun(feature, resolution) {

        const rotation = feature.get('rotation') || 0;
        return new ol.style.Style({
            image: new ol.style.Icon({
                src: this.carImg,
                size: [60, 60],
                // scale: 0.5,
                rotation: -rotation
            })
        });

    }

    /**
     * 更新数据
     * @param  {Object} data gps对象
     */
    update(data) {

        data.forEach((value) => {

            value.geoCoord = value.geoCoord || [value.longtitude, value.latitude];
            value.id = value.id || value.cardId;
            const geometry = this.createGeometry(value.geoCoord);

            let feature = this.source.getFeatureById(value.id);
            if (feature) {

                if (this.rotation) {

                    const start = feature.getGeometry().getCoordinates();
                    const end = geometry.getCoordinates();
                    var dx = end[0] - start[0];
                    var dy = end[1] - start[1];
                    var rotation = Math.atan2(dy, dx);
                    feature.set('rotation', rotation);

                }


                feature.setGeometry(geometry);

            } else {

                this.createFeature(value);

            }

        });

    }

    /**
     * 创建空间对象
     * @param  {array} geoCoord 坐标
     * @return {Object} geometry 空间对象
     */
    createGeometry(geoCoord) {

        let coords = mapTool.transform(geoCoord);
        const geometry = new ol.geom.Point(coords);
        return geometry;

    }

    /**
     * 创建feature
     * @param  {Object} object 属性参数 {id,geoCoord}
     */
    createFeature(object) {

        const geometry = this.createGeometry(object.geoCoord);
        let gpsFeature = new ol.Feature({
            geometry: geometry
        });
        gpsFeature.setId(object.id);
        gpsFeature.setProperties(object);
        this.source.addFeature(gpsFeature);

    }

    /**
     * 移除gps对象
     * @param  {String} id 唯一标识
     */
    remove(id) {

        const feature = this.source.getFeatureById(id);
        this.source.removeFeature(feature);

    }

    /**
     * 清空
     */
    clear() {

        this.source.clear();

    }

    // connect() {

    //     let socket = new SockJS('http://192.168.3.48:8080/sdjg/websocket');
    //     this.stompClient = Stomp.Stomp.over(socket);
    //     this.stompClient.connect({}, (frame) => {

    //         this.stompClient.subscribe('/topic/police', (greeting) => {

    //             this.update(JSON.parse(greeting.body).data);

    //         });

    //     });

    // }
    // disconnect() {

    //     if (this.stompClient != null) {

    //         this.stompClient.disconnect();

    //     }
    //     console.info('Disconnected');

    // }
}