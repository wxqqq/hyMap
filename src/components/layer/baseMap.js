/*
 * @Author: wxq
 * @Date:   2017-04-20 17:03:05
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-19 14:05:08
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\baseMap.js
 * @File Name: baseMap.js
 * @Descript: 
 */
'use strict';
import baseLayer from '../layer/baselayer';

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
    initSource(theme) {

        let source = undefined;
        if (typeof theme == 'object') {

            source = new ol.source.XYZ({
                url: 'https://b.tiles.mapbox.com/v4/' + theme.mapId + '/{z}/{x}/{y}.png?access_token=' + theme.key
                    // url: 'https://api.mapbox.com/v4/' + theme.mapId + '/{z}/{x}/{y}.png?access_token=' + theme.key
            });

        } else if (theme == 'white') {

            source = new ol.source.OSM({
                logo: false
            });


        } else if (theme == 'dark') {


            source = new ol.source.TileWMS({
                url: this._serverUrl + '/wms',
                params: {
                    'LAYERS': 'hygis:china_vector_group_dark'
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            });

        } else if (theme == 'test') {

            let url = 'http://localhost:8080/alllayers/';
            source = new ol.source.XYZ({
                // projection: 'EPSG:3857',

                tileGrid: ol.tilegrid.createXYZ({
                    minZoom: 3,
                    maxZoom: 7
                }),
                wrapX: false,
                tileUrlFunction: (tileCoord) => {

                    var x = 'C' + this.zeroPad(tileCoord[1], 8, 16);
                    var y = 'R' + this.zeroPad(-tileCoord[2] - 1, 8, 16);
                    var z = 'L' + this.zeroPad(tileCoord[0], 2, 10);
                    return url + '/' + z + '/' + y + '/' + x + '.png';

                }
            });



        } else if (theme == 'arcgis') {

            var url = 'http://192.168.4.35:6080/arcgis/rest/services/test/test2/MapServer';
            source = new ol.source.ImageArcGISRest({
                ratio: 1,
                params: {},
                url: url
            });

        } else {

            source = new ol.source.TileWMS({
                url: this._serverUrl + '/wms',
                params: {
                    'LAYERS': 'hygis:china_vector_group'
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            });

        }
        return source;

    }

    setTheme(type) {

        const source = this.initSource(type);
        this.setSource(source);

    }

    zeroPad(num, len, radix) {

        var str = num.toString(radix || 10);
        while (str.length < len) {

            str = '0' + str;

        }

        return str;

    }
}