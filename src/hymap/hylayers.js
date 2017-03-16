import hytooltip from '../hymap/hytooltip';
import hyMapQuery from '../query/hyMapQuery';

const ol = require('../../public/lib/ol');
export default class hyLayer extends hytooltip {
    constructor(options) {

        super(options);
        this._basicLayersArray = new ol.Collection();
        this._basicLayerGroup = new ol.layer.Group();
        this._basicLayerGroup.setLayers(this._basicLayersArray);
        this.baseLayer = new ol.layer.Tile();
        this.geoVectorSource = null;
        this.geoTables = ['province', 'city', 'counties'];

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

            evt.feature.source = evt.target;
            evt.feature.set('style', this._regionsObj[evt.feature.get('name')]);

        });
        let geoVector = new ol.layer.Vector({
            source: geoVectorSource,
            style: this._geoStyleFn,
            type: 'geo'
        });
        geoVectorSource.vector = geoVector;

        return geoVector;

    }

    /**
     * [setGeoSource description]
     * @param {[type]} mapName geo名称 格式：中国|山东省|济南市 为空不加载地图边界信息，否则按传入参数最后一个为当前级别进行数据加载。
     */
    setGeoSource(mapName) {

        if (mapName) {

            //去除最后一个特殊符号，避免数组取值不正确
            mapName = this.deleteEndSign(mapName, '|');

            this.mapNameArray = mapName.split('|');
            this.geoLevel = this.mapNameArray.length - 1;
            const column = {
                level: this.geoLevel,
                name: this.mapNameArray[this.mapNameArray.length - 1]
            };

            this.geoQuery(column, false);

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

    showGeo() {

        this.geoVector.setVisible(true);

    }

    hideGeo() {

        this.geoVector.setVisible(false);

    }

    /**
     * [setTheme description]
     * @param {String} theme [description]
     */
    setTheme(theme = 'white') {

        if (typeof theme == 'object') {

            this.baseLayer.setSource(

                new ol.source.XYZ({
                    url: 'https://b.tiles.mapbox.com/v4/' + theme.mapId + '/{z}/{x}/{y}.png?access_token=' + theme.key
                        // url: 'https://api.mapbox.com/v4/' + theme.mapId + '/{z}/{x}/{y}.png?access_token=' + theme.key
                        // url: 'https://api.mapbox.com/v4/' + theme.mapId + '/{z}/{x}/{y}.png?access_token=' + theme.key
                })

            );

        } else if (theme == 'white') {

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

    }
    geoGo(options) {

        this.geoLevel += 1; //当前数据的level+1;
        this.rollBackName = options.parentname;
        this.geoQuery({
            parentname: this.rollBackName,
            name: options.name,
            level: this.geoLevel
        }, true);


    }

    geoGoBack() {

        this.geoLevel -= 1;
        let name = this.rollBackName;
        const level = this.mapNameArray.length - 1;
        if (this.geoLevel == level) {

            name = this.mapNameArray[this.mapNameArray.length - 1];

        } else if (this.geoLevel < level) {

            this.geoLevel += 1;
            return;

        }

        this.geoQuery({
            parentname: this.rollBackName,
            name: name,
            level: this.geoLevel
        }, true);

    }

    /**
     * [geoQuery description]
     * @param  {[type]} prototype{level,name,} [description]
     * @return {[type]}        [description]
     */
    geoQuery(prototype, flag = true) {

        const tableKey = this.geoTables[prototype.level];
        if (!tableKey) {

            return;

        }
        const table = 'area_china_' + tableKey;
        const column = 'parentname';
        const filter = ol.format.filter.equalTo(column, prototype.name);

        hyMapQuery.spatialQuery({
            'url': this._serverUrl,
            'msg': hyMapQuery.createFeatureRequest([table], filter),
            'callback': (features) => {

                this.geoQueryCallback(features, flag);

            }
        });

    }

    geoQueryCallback(features, flag) {

        this.geoVectorSource.clear();
        this.geoVectorSource.addFeatures(features);
        //地图根据范围重新定位
        if (features.length > 0 && flag) {

            this.view.fit(this.geoVectorSource.getExtent());

        }


    }

    deleteEndSign(str, sign) {

        return (str.substring(str.length - 1) == sign) ? str.substring(0, str.length - 1) : str;

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