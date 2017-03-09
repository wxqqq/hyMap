import hyMapQuery from '../query/hyMapQuery';
import tooltip from '../hymap/hytooltip';

const ol = require('../../public/lib/ol');

export default class hyLayer extends tooltip {
    constructor(options) {

        super(options);
        this._basicLayersArray = new ol.Collection();
        this._basicLayerGroup = new ol.layer.Group({
            zIndex: 99
        });
        this._basicLayerGroup.setLayers(this._basicLayersArray);
        this.baseLayer = new ol.layer.Tile();
        this.geoVectorSource = null;

    }

    /**
     * 创建基础图层组
     * @return {[type]} [description]
     */
    _createBasicGroup() {

        this._basicLayersArray.push(this.baseLayer);
        this.map.addLayer(this._basicLayerGroup);
        this.geoVector = this.createGeoLayer();
        this._basicLayersArray.push(this.geoVector);
        this.geoVectorSource = this.geoVector.getSource();

    }

    /**
     * [createGeoLayer description]
     * @return {[type]} [description]
     */
    createGeoLayer() {

        let geoVectorSource = new ol.source.Vector();
        geoVectorSource.on('addfeature', evt => {

            evt.feature.source = this.geoVectorSource;
            evt.feature.set('style', this._regionsObj[evt.feature.get('name')]);

        });
        let geoVector = new ol.layer.Vector({
            source: geoVectorSource,
            style: this._geoStyleFn
        });
        geoVector.set('type', 'geo');
        geoVectorSource.vector = geoVector;

        return geoVector;

    }

    /**
     * [setGeoSource description]
     * @param {[type]} mapName [description]
     */
    setGeoSource(mapName) {

        if (mapName) {

            this.geoVectorSource.clear();
            hyMapQuery.spatialQuery({
                'url': this._serverUrl,
                'msg': hyMapQuery.createFeatureRequest([mapName + '_countries']),
                'callback': (features) => {

                    this.geoVectorSource.addFeatures(features);

                }
            });

        } else {

            this.baseLayer.setSource();

        }

    }

    setGeoStyle({
        regions,
        itemStyle,
        label
    }) {

        this._regionsObj = this._createRegionsStyle(regions);
        let vectorStyle = this._createGeoStyle(itemStyle || this._geo.itemStyle, label || this._geo.label);
        this.geoVector.set('fstyle', vectorStyle);

    }

    /**
     * [setTheme description]
     * @param {String} theme [description]
     */
    setTheme(theme = 'dark') {

        if (theme == 'white') {

            this.baseLayer.setSource(
                new ol.source.OSM({
                    logo: false
                })
            );

        } else if (theme == 'dark') {

            this.baseLayer.setSource(
                new ol.source.TileWMS({
                    url: this._serverUrl + '/wms',
                    params: {
                        'LAYERS': 'hygis:china_vector_group_dark'
                    },
                    serverTyjpe: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            );

        } else {

            this.baseLayer.setSource(
                new ol.source.TileWMS({
                    url: this._serverUrl + '/wms',
                    params: {
                        'LAYERS': 'hygis:china_vector_group'
                    },
                    serverTyjpe: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            );

        }

        //放到图层添加功能中


        // this._basicLayersArray.push(new ol.layer.Tile({
        //     source: new ol.source.TileWMS({
        //         url: this.geoserverUrl + '/wms',
        //         params: {
        //             'LAYERS': 'shandong_area',
        //         },
        //         serverTyjpe: 'geoserver',
        //         crossOrigin: 'anonymous'
        //     })
        // }));

        // const wmsSource = new ol.source.TileWMS({
        //     url: this.geoserverUrl + '/wms',
        //     params: {
        //         'LAYERS': 'csdlzxx_pl'
        //     },
        //     serverTyjpe: 'geoserver',
        //     crossOrigin: 'anonymous'
        // });
        // this.wmsTile = new ol.layer.Tile({
        //     source: wmsSource
        // });

        // this._basicLayersArray.push(this.wmsTile);
        // 

    }

    /**
     * [_geoStyleFn description]
     * @param  {[type]} feature    [description]
     * @param  {[type]} resolution [description]
     * @param  {String} type       [description]
     * @return {[type]}            [description]
     */
    _geoStyleFn(feature, resolution, type = 'normal') {

        const vectorStyle = feature.source.vector.get('fstyle');
        const style = feature.get('style') || vectorStyle;
        const text = style[type].getText();
        text && text.show && text.setText(feature.get('name'));
        return style[type];

    }
}