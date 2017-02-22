import hyMapQuery from '../query/hyMapQuery';
import hyMapStyle from '../style/hyMapStyle';

const ol = require('../../public/lib/ol');

export default class hyLayer extends hyMapStyle {
    constructor(options) {

        super(options);
        this._basicLayersArray = new ol.Collection();
        this._basicLayerGroup = new ol.layer.Group();
        this._basicLayerGroup.setLayers(this._basicLayersArray);

    }

    /**
     * 创建基础图层组
     * @return {[type]} [description]
     */
    _createBasicGroup() {

        this.map.addLayer(this._basicLayerGroup);

    }

    _createBasicLayer() {

        // this._basicLayersArray.push(new ol.layer.Tile({
        //     source: new ol.source.OSM({
        //         logo: false
        //     })
        // }));
        //放到图层添加功能中
        this.geoserverUrl = this._geo.serverUrl;
        const style1 = this._createItemStyle(this._geo.itemStyle);
        this._createRegionsStyle();
        let vectorStyle = this._createGeoStyle(style1);
        let vectorSource = new ol.source.Vector();

        vectorSource.on('addfeature', evt => {

            evt.feature.source = vectorSource;
            evt.feature.set('style', this._regionsObj[evt.feature.get('xzqmc')]);

        });
        let vector = new ol.layer.Vector({
            source: vectorSource,
            style: function(feature, resolution, type) {

                const style = feature.get('style') || vectorStyle;
                type = type ? type : 'normal';

                // feature.getGeometry().getType() === 'Point' &&
                style[type].setText(new ol.style.Text({
                    text: feature.get('xzqmc')
                }));
                return style[type];

            }
        });
        vector.set('type', 'geo');
        vectorSource.vector = vector;

        this._basicLayersArray.push(vector);

        hyMapQuery.spatialQuery({
            'url': this.geoserverUrl,
            'msg': hyMapQuery.createFeatureRequest([this._geo.map]),
            'callback': function(features) {

                vectorSource.addFeatures(features);

            }
        });

        // then post the request and add the received features to a layer

        // this._basicLayersArray.push(new ol.layer.Tile({
        //     source: new ol.source.TileWMS({
        //         url: this.geoserverUrl + '/wms',
        //         params: {
        //             'LAYERS': this._geo.map,
        //             'env': 'color:00FF00;name:triangle;size:12'
        //         },
        //         serverTyjpe: 'geoserver',
        //         crossOrigin: 'anonymous'
        //     })
        // }));

        const wmsSource = new ol.source.TileWMS({
            url: this.geoserverUrl + '/wms',
            params: {
                'LAYERS': 'csdlzxx_pl'
            },
            serverTyjpe: 'geoserver',
            crossOrigin: 'anonymous'
        });
        this.wmsTile = new ol.layer.Tile({
            source: wmsSource
        });

        // this._basicLayersArray.push(this.wmsTile);

    }
}