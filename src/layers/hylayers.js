const ol = require('openlayers/dist/ol-debug');
const olstyle = require('openlayers/dist/ol.css');
import hymap from './src/hymap';
export default class hyLayer {
    constructor() {}
    var map = new hymap();

    _createBasicLayer() {
        //放到图层添加功能中
        this.geoserverUrl = 'http://192.168.0.50:8080/geoserver/wms';
        const wmsSource = new ol.source.TileWMS({
            url: this.geoserverUrl,
            params: {
                'LAYERS': 'csdlzxx_pl'
            },
            serverTyjpe: 'geoserver',
            crossOrigin: 'anonymous'
        });
        this.wmsTile = new ol.layer.Tile({
            source: wmsSource
        });
        this.map.addLayer(new ol.layer.Tile({
            source: new ol.source.OSM()
        }));
        this.map.addLayer(new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: this.geoserverUrl,
                params: {
                    'LAYERS': 'xzqh'
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            })
        }));
        this.map.addLayer(new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: this.geoserverUrl,
                params: {
                    'LAYERS': 'hygis:xzqhbz_pt'
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            })
        }));
        this.map.addLayer(this.wmsTile);

    }
}