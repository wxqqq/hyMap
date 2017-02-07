const ol = require('../../public/lib/ol-debug');

export default class hyLayer {

    constructor(options) {
        this._basicLayersArray = null;
        this._basicLayerGroup = null;

    }

    /**
     * 创建基础图层组
     * @return {[type]} [description]
     */
    _createBasicGroup() {

        this._basicLayersArray = new ol.Collection();
        this._basicLayerGroup = new ol.layer.Group();
        this._basicLayerGroup.setLayers(this._basicLayersArray);
        this.map.addLayer(this._basicLayerGroup);

    }

    _createBasicLayer() {

        //放到图层添加功能中
        this.geoserverUrl = 'http://192.168.0.50:8080/geoserver/wms';

        this._basicLayersArray.push(new ol.layer.Tile({
            source: new ol.source.OSM()
        }));
        this._basicLayersArray.push(new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: this.geoserverUrl,
                params: {
                    'LAYERS': this._geo.map
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            })
        }));
        this._basicLayersArray.push(new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: this.geoserverUrl,
                params: {
                    'LAYERS': 'hygis:xzqhbz_pt'
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            })
        }));

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

        this._basicLayersArray.push(this.wmsTile);

    }
}