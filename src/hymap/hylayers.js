import hytooltip from '../hymap/hytooltip';
import hyMapQuery from '../query/hyMapQuery';

const ol = require('../../public/lib/ol');
require('../../public/lib/mapbox-streets-v6-style.js');
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
            mapName = (mapName.substring(mapName.length - 1) == '|') ? mapName.substring(0, mapName.length - 1) : mapName;

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

        if (theme == 'white') {

            var key = 'sk.eyJ1Ijoiemhhbmd5dWppZSIsImEiOiJkTEp6WDZrIn0.nY5bsQlZegBbb2uGgJ5jEA';


            this.baseLayer.setSource(
                new ol.source.XYZ({
                    // url: 'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + key
                    url: 'https://api.mapbox.com/v4/zhangyujie.a80cdc83/{z}/{x}/{y}.png?access_token=' + key
                })

            );

            this.baseLayer.setSource(
                new ol.source.OSM({
                    logo: false
                })
            );

        } else if (theme == 'dark') {

            const key = 'sk.eyJ1Ijoiemhhbmd5dWppZSIsImEiOiJkTEp6WDZrIn0.nY5bsQlZegBbb2uGgJ5jEA';
            this.baseLayer.setSource(
                new ol.source.XYZ({
                    // url: 'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + key
                    url: 'https://api.mapbox.com/v4/zhangyujie.a80cdc83/{z}/{x}/{y}.png?access_token=' + key
                })

            );
            // this.baseLayer.setSource(
            //     new ol.source.TileWMS({
            //         url: this._serverUrl + '/wms',
            //         params: {
            //             'LAYERS': 'hygis:china_vector_group_dark'
            //         },
            //         serverTyjpe: 'geoserver',
            //         crossOrigin: 'anonymous'
            //     })
            // );

        } else if (theme = 'mapbox') {



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

function createMapboxStreetsV6Style() {
    var fill = new ol.style.Fill({
        color: ''
    });
    var stroke = new ol.style.Stroke({
        color: '',
        width: 1
    });
    var polygon = new ol.style.Style({
        fill: fill
    });
    var strokedPolygon = new ol.style.Style({
        fill: fill,
        stroke: stroke
    });
    var line = new ol.style.Style({
        stroke: stroke
    });
    var text = new ol.style.Style({
        text: new ol.style.Text({
            text: '',
            fill: fill,
            stroke: stroke
        })
    });
    var iconCache = {};

    function getIcon(iconName) {
        var icon = iconCache[iconName];
        if (!icon) {
            icon = new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'https://cdn.rawgit.com/mapbox/maki/master/icons/' + iconName + '-15.svg',
                    imgSize: [15, 15]
                })
            });
            iconCache[iconName] = icon;
        }
        return icon;
    }
    var styles = [];
    return function(feature, resolution) {
        var length = 0;
        var layer = feature.get('layer');
        var cls = feature.get('class');
        var type = feature.get('type');
        var scalerank = feature.get('scalerank');
        var labelrank = feature.get('labelrank');
        var adminLevel = feature.get('admin_level');
        var maritime = feature.get('maritime');
        var disputed = feature.get('disputed');
        var maki = feature.get('maki');
        var geom = feature.getGeometry().getType();
        if (layer == 'landuse' && cls == 'park') {
            fill.setColor('#d8e8c8');
            styles[length++] = polygon;
        } else if (layer == 'landuse' && cls == 'cemetery') {
            fill.setColor('#e0e4dd');
            styles[length++] = polygon;
        } else if (layer == 'landuse' && cls == 'hospital') {
            fill.setColor('#fde');
            styles[length++] = polygon;
        } else if (layer == 'landuse' && cls == 'school') {
            fill.setColor('#f0e8f8');
            styles[length++] = polygon;
        } else if (layer == 'landuse' && cls == 'wood') {
            fill.setColor('rgb(233,238,223)');
            styles[length++] = polygon;
        } else if (layer == 'waterway' &&
            cls != 'river' && cls != 'stream' && cls != 'canal') {
            stroke.setColor('#a0c8f0');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'waterway' && cls == 'river') {
            stroke.setColor('#a0c8f0');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'waterway' && (cls == 'stream' ||
                cls == 'canal')) {
            stroke.setColor('#a0c8f0');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'water') {
            fill.setColor('#a0c8f0');
            styles[length++] = polygon;
        } else if (layer == 'aeroway' && geom == 'Polygon') {
            fill.setColor('rgb(242,239,235)');
            styles[length++] = polygon;
        } else if (layer == 'aeroway' && geom == 'LineString' &&
            resolution <= 76.43702828517625) {
            stroke.setColor('#f0ede9');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'building') {
            fill.setColor('#f2eae2');
            stroke.setColor('#dfdbd7');
            stroke.setWidth(1);
            styles[length++] = strokedPolygon;
        } else if (layer == 'tunnel' && cls == 'motorway_link') {
            stroke.setColor('#e9ac77');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'tunnel' && cls == 'service') {
            stroke.setColor('#cfcdca');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'tunnel' &&
            (cls == 'street' || cls == 'street_limited')) {
            stroke.setColor('#cfcdca');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'tunnel' && cls == 'main' &&
            resolution <= 1222.99245256282) {
            stroke.setColor('#e9ac77');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'tunnel' && cls == 'motorway') {
            stroke.setColor('#e9ac77');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'tunnel' && cls == 'path') {
            stroke.setColor('#cba');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'tunnel' && cls == 'major_rail') {
            stroke.setColor('#bbb');
            stroke.setWidth(2);
            styles[length++] = line;
        } else if (layer == 'road' && cls == 'motorway_link') {
            stroke.setColor('#e9ac77');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'road' && (cls == 'street' ||
                cls == 'street_limited') && geom == 'LineString') {
            stroke.setColor('#cfcdca');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'road' && cls == 'main' &&
            resolution <= 1222.99245256282) {
            stroke.setColor('#e9ac77');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'road' && cls == 'motorway' &&
            resolution <= 4891.96981025128) {
            stroke.setColor('#e9ac77');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'road' && cls == 'path') {
            stroke.setColor('#cba');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'road' && cls == 'major_rail') {
            stroke.setColor('#bbb');
            stroke.setWidth(2);
            styles[length++] = line;
        } else if (layer == 'bridge' && cls == 'motorway_link') {
            stroke.setColor('#e9ac77');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'bridge' && cls == 'motorway') {
            stroke.setColor('#e9ac77');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'bridge' && cls == 'service') {
            stroke.setColor('#cfcdca');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'bridge' &&
            (cls == 'street' || cls == 'street_limited')) {
            stroke.setColor('#cfcdca');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'bridge' && cls == 'main' &&
            resolution <= 1222.99245256282) {
            stroke.setColor('#e9ac77');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'bridge' && cls == 'path') {
            stroke.setColor('#cba');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'bridge' && cls == 'major_rail') {
            stroke.setColor('#bbb');
            stroke.setWidth(2);
            styles[length++] = line;
        } else if (layer == 'admin' && adminLevel >= 3 && maritime === 0) {
            stroke.setColor('#9e9cab');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'admin' && adminLevel == 2 &&
            disputed === 0 && maritime === 0) {
            stroke.setColor('#9e9cab');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'admin' && adminLevel == 2 &&
            disputed === 1 && maritime === 0) {
            stroke.setColor('#9e9cab');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'admin' && adminLevel >= 3 && maritime === 1) {
            stroke.setColor('#a0c8f0');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'admin' && adminLevel == 2 && maritime === 1) {
            stroke.setColor('#a0c8f0');
            stroke.setWidth(1);
            styles[length++] = line;
        } else if (layer == 'country_label' && scalerank === 1) {
            text.getText().setText(feature.get('name_en'));
            text.getText().setFont('bold 11px "Open Sans", "Arial Unicode MS"');
            fill.setColor('#334');
            stroke.setColor('rgba(255,255,255,0.8)');
            stroke.setWidth(2);
            styles[length++] = text;
        } else if (layer == 'country_label' && scalerank === 2 &&
            resolution <= 19567.87924100512) {
            text.getText().setText(feature.get('name_en'));
            text.getText().setFont('bold 10px "Open Sans", "Arial Unicode MS"');
            fill.setColor('#334');
            stroke.setColor('rgba(255,255,255,0.8)');
            stroke.setWidth(2);
            styles[length++] = text;
        } else if (layer == 'country_label' && scalerank === 3 &&
            resolution <= 9783.93962050256) {
            text.getText().setText(feature.get('name_en'));
            text.getText().setFont('bold 9px "Open Sans", "Arial Unicode MS"');
            fill.setColor('#334');
            stroke.setColor('rgba(255,255,255,0.8)');
            stroke.setWidth(2);
            styles[length++] = text;
        } else if (layer == 'country_label' && scalerank === 4 &&
            resolution <= 4891.96981025128) {
            text.getText().setText(feature.get('name_en'));
            text.getText().setFont('bold 8px "Open Sans", "Arial Unicode MS"');
            fill.setColor('#334');
            stroke.setColor('rgba(255,255,255,0.8)');
            stroke.setWidth(2);
            styles[length++] = text;
        } else if (layer == 'marine_label' && labelrank === 1 &&
            geom == 'Point') {
            text.getText().setText(feature.get('name_en'));
            text.getText().setFont(
                'italic 11px "Open Sans", "Arial Unicode MS"');
            fill.setColor('#74aee9');
            stroke.setColor('rgba(255,255,255,0.8)');
            stroke.setWidth(1);
            styles[length++] = text;
        } else if (layer == 'marine_label' && labelrank === 2 &&
            geom == 'Point') {
            text.getText().setText(feature.get('name_en'));
            text.getText().setFont(
                'italic 11px "Open Sans", "Arial Unicode MS"');
            fill.setColor('#74aee9');
            stroke.setColor('rgba(255,255,255,0.8)');
            stroke.setWidth(1);
            styles[length++] = text;
        } else if (layer == 'marine_label' && labelrank === 3 &&
            geom == 'Point') {
            text.getText().setText(feature.get('name_en'));
            text.getText().setFont(
                'italic 10px "Open Sans", "Arial Unicode MS"');
            fill.setColor('#74aee9');
            stroke.setColor('rgba(255,255,255,0.8)');
            stroke.setWidth(1);
            styles[length++] = text;
        } else if (layer == 'marine_label' && labelrank === 4 &&
            geom == 'Point') {
            text.getText().setText(feature.get('name_en'));
            text.getText().setFont(
                'italic 9px "Open Sans", "Arial Unicode MS"');
            fill.setColor('#74aee9');
            stroke.setColor('rgba(255,255,255,0.8)');
            stroke.setWidth(1);
            styles[length++] = text;
        } else if (layer == 'place_label' && type == 'city' &&
            resolution <= 1222.99245256282) {
            text.getText().setText(feature.get('name_en'));
            text.getText().setFont('11px "Open Sans", "Arial Unicode MS"');
            fill.setColor('#333');
            stroke.setColor('rgba(255,255,255,0.8)');
            stroke.setWidth(1);
            styles[length++] = text;
        } else if (layer == 'place_label' && type == 'town' &&
            resolution <= 305.748113140705) {
            text.getText().setText(feature.get('name_en'));
            text.getText().setFont('9px "Open Sans", "Arial Unicode MS"');
            fill.setColor('#333');
            stroke.setColor('rgba(255,255,255,0.8)');
            stroke.setWidth(1);
            styles[length++] = text;
        } else if (layer == 'place_label' && type == 'village' &&
            resolution <= 38.21851414258813) {
            text.getText().setText(feature.get('name_en'));
            text.getText().setFont('8px "Open Sans", "Arial Unicode MS"');
            fill.setColor('#333');
            stroke.setColor('rgba(255,255,255,0.8)');
            stroke.setWidth(1);
            styles[length++] = text;
        } else if (layer == 'place_label' &&
            resolution <= 19.109257071294063 && (type == 'hamlet' ||
                type == 'suburb' || type == 'neighbourhood')) {
            text.getText().setText(feature.get('name_en'));
            text.getText().setFont('bold 9px "Arial Narrow"');
            fill.setColor('#633');
            stroke.setColor('rgba(255,255,255,0.8)');
            stroke.setWidth(1);
            styles[length++] = text;
        } else if (layer == 'poi_label' && resolution <= 19.109257071294063 &&
            scalerank == 1 && maki !== 'marker') {
            styles[length++] = getIcon(maki);
        } else if (layer == 'poi_label' && resolution <= 9.554628535647032 &&
            scalerank == 2 && maki !== 'marker') {
            styles[length++] = getIcon(maki);
        } else if (layer == 'poi_label' && resolution <= 4.777314267823516 &&
            scalerank == 3 && maki !== 'marker') {
            styles[length++] = getIcon(maki);
        } else if (layer == 'poi_label' && resolution <= 2.388657133911758 &&
            scalerank == 4 && maki !== 'marker') {
            styles[length++] = getIcon(maki);
        } else if (layer == 'poi_label' && resolution <= 1.194328566955879 &&
            scalerank >= 5 && maki !== 'marker') {
            styles[length++] = getIcon(maki);
        }
        styles.length = length;
        return styles;
    };
}