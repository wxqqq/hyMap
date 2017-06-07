/*
 * @Author: wxq
 * @Date:   2017-04-18 10:04:23
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-07 14:23:48
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\geo\geo.js
 * @File Name: geo.js
 * @Descript: 
 */
'use strict';

import baseMap from './baseMap';
import hytooltip from '../../hymap/hytooltip';
import hyMapQuery from '../../query/hyMapQuery';
import mapTool from '../../util/mapToolUtil';

const ol = require('ol');

export default class hyGeo extends hytooltip {
    constructor(options) {

        super(options);
        this._basicLayersArray = new ol.Collection();
        this._basicLayerGroup = new ol.layer.Group();
        this._basicLayerGroup.setLayers(this._basicLayersArray);

        this.geoVectorSource = null;
        this.geoDrillDown = false;
        this.geoTables = ['province', 'city', 'counties'];

    }

    /**
     * 创建基础图层组
     * @return {[type]} [description]
     */
    _createBasicGroup() {

        //底图
        this.baseLayer = new baseMap({});
        this._basicLayersArray.push(this.baseLayer.getLayer());
        // this.map.addLayer(this._basicLayerGroup);
        this.map.addLayer(this.baseLayer.getLayer());
        var tian_di_tu_satellite_layer = new ol.layer.Tile({
            baseLayer: true,
            title: '卫星',
            visible: false,
            displayInLayerSwitcher: false,
            source: new ol.source.XYZ({
                url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}'
            })
        });

        this.map.addLayer(tian_di_tu_satellite_layer);

        // var tian_di_tu_road_layer = new ol.layer.Tile({
        //     title: "天地图路网",
        //     source: new ol.source.XYZ({
        //         url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
        //     })
        // });
        // this.map.addLayer(tian_di_tu_road_layer);
        // var tian_di_tu_annotation = new ol.layer.Tile({
        //     title: "标注",
        //     source: new ol.source.XYZ({
        //         url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
        //     })
        // });
        // this.map.addLayer(tian_di_tu_annotation);
        //浮动区域
        this.geoVector = this.createGeoLayer();
        // this._basicLayersArray.push(this.geoVector);
        this.map.addLayer(this.geoVector);
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
            name: '区域',
            source: geoVectorSource,
            style: (feature, resolution, type) => {

                return this._geoStyleFn(feature, resolution, type);

            },
            type: 'geo',
            visible: true
        });
        geoVector.set('serie', {
            'labelColumn': 'name'
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
            mapName = mapTool.deleteEndSign(mapName, '|');

            this.mapNameArray = mapName.split('|');
            this.geoLevel = this.mapNameArray.length - 1;
            const column = {
                level: this.geoLevel,
                name: this.mapNameArray[this.mapNameArray.length - 1]
            };

            this.geoQuery(column, false);

        } else {
            this.geoVector.setVisible(false);
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

    showBaseMap() {

        this.baseLayer.show(true);

    }

    hideBaseMap() {

        this.baseLayer.hide(false);

    }

    /**
     * [setTheme description]
     * @param {String} theme [description]
     */
    setTheme(theme) {

        this.baseLayer.setUrl(this._serverUrl);
        this.baseLayer.setTheme(theme);

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


}