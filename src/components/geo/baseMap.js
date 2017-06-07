/*
 * @Author: wxq
 * @Date:   2017-04-20 17:03:05
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-05-27 15:40:56
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\geo\baseMap.js
 * @File Name: baseMap.js
 * @Descript: 
 */
'use strict';
import baseLayer from '../layer/baseLayer';
const ol = require('ol');

export default class baseMap extends baseLayer {
    constructor(options) {
        super(options);
        this.layer = new ol.layer.Tile({
            title: '地图',
            baseLayer: true,
            displayInLayerSwitcher: false
        });
        this._serverUrl = options && options.serverUrl || '';

    }
    setUrl(url) {
        this._serverUrl = url;
    }
    getSource(theme) {
        let source = undefined;
        if (typeof theme == 'object') {

            source = new ol.source.XYZ({
                url: 'https://b.tiles.mapbox.com/v4/' + theme.mapId + '/{z}/{x}/{y}.png?access_token=' + theme.key
                    // url: 'https://api.mapbox.com/v4/' + theme.mapId + '/{z}/{x}/{y}.png?access_token=' + theme.key
            })

        } else if (theme == 'white') {

            source = new ol.source.OSM({
                logo: false
            })


        } else if (theme == 'dark') {


            source = new ol.source.TileWMS({
                url: this._serverUrl + '/wms',
                params: {
                    'LAYERS': 'hygis:china_vector_group_dark'
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            })

        } else {

            source = new ol.source.TileWMS({
                url: this._serverUrl + '/wms',
                params: {
                    'LAYERS': 'hygis:china_vector_group'
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            })

        }
        return source;
    }

    setTheme(type) {
        const source = this.getSource(type);
        this.setSource(source);
    }
}