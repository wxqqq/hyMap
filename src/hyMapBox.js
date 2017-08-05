/*
 * @Author: wxq
 * @Date:   2017-08-02 17:50:57
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-08-02 18:15:19
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\hyMapBox.js
 * @File Name: hyMapBox.js
 * @Descript: 
 */
'use strict';
import events from './events/events';
import mapboxgl from 'mapboxgl';
require('../css/ol.css');
export default class hyMapBox {
    constructor(options) {
        this._init(options);
    }

    setOption(options) {
        console.log(options)
    }
    _init(dom) {
        var tileset = 'mapbox.streets';
        var map = new mapboxgl.Map({
            container: dom, // container id
            style: {
                "version": 8,
                "sources": {
                    "raster-tiles": {
                        "type": "raster",
                        "tiles": ["http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"],
                        "tileSize": 256
                    }
                },
                "layers": [{
                    "id": "simple-tiles",
                    "type": "raster",
                    "source": "raster-tiles",
                    "minzoom": 0,
                    "maxzoom": 22
                }]
            },
            center: [-74.50, 40], // starting position
            zoom: 9 // starting zoom,

        });
    }

}
Object.assign(hyMapBox.prototype, events);