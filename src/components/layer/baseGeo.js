/*
 * @Author: wxq
 * @Date:   2017-04-18 10:04:23
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-15 18:46:30
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\geo\baseGeo.js
 * @File Name: baseGeo.js
 * @Descript: 
 */
'use strict';

import hytooltip from '../tooltip/hytooltip';
import hyMapQuery from '../../query/hyMapQuery';
import mapTool from '../../util/mapToolUtil';
import baseLayer from '../layer/baselayer';
import hyStyle from '../style/hyMapStyle';

const ol = require('ol');

export default class baseGeo extends baseLayer {
    constructor(options) {

        super(options);
        this.source = null;
        this.geoDrillDown = false;
        this.serverUrl = null;
        this.geoTables = ['province', 'city', 'counties'];
        this.init();
    }

    /**
     * 初始化
     * @author WXQ
     * @date   2017-06-15
     * @return {[type]}   [description]
     */
    init() {

        //底图
        // this.map.addLayer(this._basicLayerGroup);
        // var tian_di_tu_satellite_layer = new ol.layer.Tile({
        //      baseLayer: true,
        //      title: '卫星',
        //      visible: false,
        //      displayInLayerSwitcher: false,
        //      source: new ol.source.XYZ({
        //          url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}'
        //      })
        //  });


        // this.map.addLayer(tian_di_tu_satellite_layer);

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
        this.layer = this.createGeoLayer();
        // this._basicLayersArray.push(this.layer);
        // this.map.addLayer(this.layer);
        this.source = this.layer.getSource();
        this.style = new hyStyle();

    }

    /**
     * [createGeoLayer description]
     * @return {[type]} [description]
     */
    createGeoLayer() {

        let source = new ol.source.Vector();

        source.on('addfeature', evt => {

            evt.feature.source = evt.target;
            evt.feature.set('style', this._regionsObj[evt.feature.get('name')]);

        });
        let layer = new ol.layer.Vector({
            name: '区域',
            source: source,
            style: (feature, resolution, type) => {

                return this.style._geoStyleFn(feature, resolution, type);

            },
            type: 'geo',
            visible: true
        });
        layer.set('serie', {
            'labelColumn': 'name'
        });
        source.vector = layer;

        return layer;

    }

    setGeo(geo) {

        this.setGeoStyle(geo);
        this.setGeoSource(geo.map);
        this.setGeoDrillDown(geo.drillDown);

    }

    /**
     * 设置数据源
     * @param {[type]} mapName geo名称 格式：中国|山东省|济南市 为空不加载地图边界信息，否则按传入参数最后一个为当前级别进行数据加载。
     */
    setGeoSource(mapName) {

        if (mapName) {

            //去除最后一个特殊符号，避免数组取值不正确
            mapName = mapTool.deleteEndSign(mapName, '|');
            if (mapName === '中国') {

                this.mapNameArray = ['中国'];

            } else {

                this.mapNameArray = mapName.split('|');

            }


            this.geoLevel = this.mapNameArray.length - 1;
            const column = {
                level: this.geoLevel,
                name: this.mapNameArray[this.mapNameArray.length - 1]
            };

            this.geoQuery(column, false);

        } else {

            this.layer.setVisible(false);

        }

    }

    setGeoStyle({
        regions,
        itemStyle,
        label
    }) {

        this._regionsObj = this.style._createRegionsStyle(regions);
        let vectorStyle = this.style._createGeoStyle(itemStyle || this._geo.itemStyle, label || this._geo.label);
        this.layer.set('fstyle', vectorStyle);

    }
    _geoStyleFn(feature, resolution, type = 'normal') {

            const style = feature.get('style') || feature.source.vector.get('fstyle');
            const rStyle = style[type];
            const serie = feature.source.vector.get('serie');
            const symbolSize = serie && serie.symbolSize;
            const serieType = serie && serie.type;

            //判断是否对图形大小进行动态设置
            if (symbolSize && symbolSize[0] != symbolSize[1]) {

                let geoScaleNum = this._scaleSize(symbolSize, feature.source.get('minValue'), feature.source.get('maxValue'));
                let value = feature.get('value') || 0;
                //对数据进行判断，
                if (feature.source instanceof ol.source.Cluster) {

                    geoScaleNum = this._scaleSize(symbolSize, feature.source.getSource().get('minValue'), feature.source.getSource().get('maxValue'));

                    const features = feature.get('features');

                    if (features) {

                        features.forEach((feature) => {

                            let fValue = feature.get('value');
                            if (fValue > value) {

                                value = fValue;

                            }

                        });

                    } else {

                        value = feature.get('value');

                    }

                }
                const scale = Math.floor(value / geoScaleNum);
                const icon = rStyle[0].getImage();
                if (icon) {

                    if (icon instanceof ol.style.Icon) {

                        icon.setScale((symbolSize[0] + scale) / (symbolSize[0] / icon.relScale));

                    } else {

                        icon.setRadius(scale + symbolSize[0]);

                    }

                }

            }

            //判断是否需要进行文本标签显示
            const text = rStyle[1].getText();
            if (text && text.show) {

                const textSize = serie && serie.labelSize;
                const column = serie && serie.labelColumn || 'value';
                let value = '';
                let textScaleNum = this._scaleSize(textSize, feature.source.get('minValue'), feature.source.get('maxValue'));

                if (feature.source instanceof ol.source.Cluster) {

                    textScaleNum = this._scaleSize(textSize, feature.source.getSource().get('minValue'), feature.source.getSource().get('maxValue'));

                    const features = feature.get('features');

                    if (features) {

                        features.forEach((feature) => {

                            let fValue = feature.get(column);
                            if (fValue > value) {

                                value = fValue;

                            }

                        });

                    } else {

                        value = feature.get(column);

                    }

                } else {

                    value = feature.get(column);

                }
                text.setText(value.toString());
                if (textSize && textSize[0] != textSize[1]) {

                    const font = text.getFont().split(' ');
                    const value = feature.get(column);
                    const scale = Math.floor(value / textScaleNum);
                    const newFont = scale + textSize[0] - 1;
                    font[2] = newFont + 'pt';
                    text.setFont(font.join(' '));

                }

            }

            return rStyle;

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
            'url': this.serverUrl,
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

    setUrl(url) {

        this.serverUrl = url;

    }
    geoQueryCallback(features, flag) {

        this.source.clear();
        this.source.addFeatures(features);
        //地图根据范围重新定位
        flag && this.view.fit(this.source.getExtent());

    }
}