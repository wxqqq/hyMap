import hytooltip from '../hymap/hytooltip';
import hyMapQuery from '../query/hyMapQuery';

const ol = require('ol');
export default class hyLayer extends hytooltip {
    constructor(options) {

        super(options);
        this._basicLayersArray = new ol.Collection();
        this._basicLayerGroup = new ol.layer.Group();
        this._basicLayerGroup.setLayers(this._basicLayersArray);
        this.baseLayer = new ol.layer.Tile();
        this.geoVectorSource = null;
        this.geoDrillDown = false;
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
        geoVectorSource.set('labelColumn', 'name');
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

    setGeo(geo) {



        this.setGeoStyle(geo);
        this.setGeoSource(geo.map);
        this.setGeoDrillDown(geo.drillDown);
        this.setTheme(geo.theme); //设置theme主题


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
    setTheme(theme) {

        if (typeof theme == 'object') {

            this.baseLayer.setSource(

                new ol.source.XYZ({
                    url: 'https://b.tiles.mapbox.com/v4/' + theme.mapId + '/{z}/{x}/{y}.png?access_token=' + theme.key
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

    /**
     * [setDrillDown description]
     * @param {Boolean} flag [description]
     */
    setGeoDrillDown(flag = false) {

        this.geoDrillDown = flag;

    }

    /**
     * [getDrillDown description]
     * @return {[type]} [description]
     */
    getGeoDrillDown() {

        return this.geoDrillDown;

    }

    /**
     * [geoGo description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
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
    geoQuery(options, flag = true) {

        const tableKey = this.geoTables[options.level];
        if (!tableKey) {

            return;

        }
        const table = 'area_china_' + tableKey;
        const column = 'parentname';
        const filter = ol.format.filter.equalTo(column, options.name);

        hyMapQuery.spatialQuery({
            'url': this._serverUrl,
            'msg': hyMapQuery.createFeatureRequest([table], filter),
            'callback': (features) => {

                if (features.length > 0) {

                    this.geoQueryCallback(features, flag);

                } else {

                    this.geoLevel -= 1; //当前数据的level+1;
                    this.rollBackName = options.parentname;

                }


            }
        });

    }

    geoQueryCallback(features, flag) {

        this.geoVectorSource.clear();
        this.geoVectorSource.addFeatures(features);
        //地图根据范围重新定位
        flag && this.view.fit(this.geoVectorSource.getExtent());

    }

    deleteEndSign(str, sign) {

        return (str.substring(str.length - 1) == sign) ? str.substring(0, str.length - 1) : str;

    }
}