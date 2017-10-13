/*
 * @Author: wxq
 * @Date:   2017-04-18 10:04:23
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-09-28 15:01:35
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\regionLayer.js
 * @File Name: regionLayer.js
 * @Descript: 
 */
'use strict';

import hyMapQuery from '../../query/hyMapQuery';
import mapTool from '../../util/mapToolUtil';
import baseLayer from '../layer/baselayer';
import hyStyle from '../style/hyMapStyle';
import labelModel from '../../model/labelModel';

const ol = require('ol');

export default class regionLayer extends baseLayer {
    /**
     * 初始化
     * @private
     * @param  {Object}   options 参数
     */
    constructor(options) {

        super(options);
        this.source = null;
        this.geoDrillDown = options.serie.drillDown || false;
        this._regionsObj = {};
        this.geoTables = ['province', 'city', 'counties'];
        this.url = options.serie.url;
        this.mapKey = options.serie.location;
        this.map = options.map;
        this.init();
        this.setGeoSource(options.serie.location);
        this.setGeoStyle(options.serie);
    
    }

    /**
     * 初始化
     * @private
     */
    init() {

        //浮动区域
        this.layer = this.createGeoLayer();
        this.layer.parent = this;
        this.setGeoDrillDown(this.geoDrillDown);
        this.map.addLayer(this.layer);
        this.source = this.layer.getSource();
        this.style = new hyStyle();
    
    }

    /**
     * 创建图层
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

                return this._geoStyleFn(feature, resolution, type);
            
            },
            type: 'geo',
            visible: true
        });
        layer.set('serie', {
            labelColumn: 'name'
        });
        layer.on('select', evt => {

            let feature = evt.selected[0];
            if (feature.source.vector.get('geoDrillDown')) {

                evt.interaction.getFeatures().remove(feature);
                this.geoGo(feature.getProperties());

            }

        });
        source.vector = layer;

        return layer;
    
    }

    /**
     * 设置样式
     * @param {Object} geo  对象 
     */
    setGeo(geo) {

        this.setGeoStyle(geo);
        this.setGeoSource(geo.map);
        this.setGeoDrillDown(geo.drillDown);
    
    }

    searchByIndexOf(keyWord, list) {

        list = [
            '河北',
            '山西',
            '内蒙古',
            '辽宁',
            '吉林',
            '黑龙江',
            '江苏',
            '浙江',
            '安徽',
            '福建',
            '江西',
            '山东',
            '河南',
            '湖北',
            '湖南',
            '广东',
            '广西',
            '海南',
            '四川',
            '贵州',
            '云南',
            '西藏',
            '陕西',
            '甘肃',
            '青海',
            '宁夏',
            '新疆',
            '香港',
            '澳门',
            '台湾'
        ];

        if (!(list instanceof Array)) {

            return;
        
        }
        var len = list.length;
        var arr = '';
        for (var i = 0; i < len; i++) {

            //如果字符串中不包含目标字符会返回-1
            if (keyWord.indexOf(list[i]) >= 0) {

                arr = list[i];
            
            }
            // if (list[i].indexOf(keyWord) >= 0) {
            //     arr = list[i];
            // }
        
        }

        return arr;
    
    }

    /**
     * 设置数据源
     * @param  {Strng}   mapName 名称
     */
    setGeoSource(mapName) {

        if (mapName) {

            //去除最后一个特殊符号，避免数组取值不正确
            mapName = mapTool.deleteEndSign(mapName, '|');
            if (mapName === '中国') {

                this.geoLevel = 0;
            
            } else {

                let name = this.searchByIndexOf(mapName);
                if (name) {

                    this.geoLevel = 1;
                
                } else {

                    this.geoLevel = 2;
                
                }
                this.mapNameArray = mapName.split('|');
            
            }

            const column = {
                level: this.geoLevel,
                name: mapName
            };

            this.geoQuery(column, false);
        
        } else {

            this.layer.setVisible(false);
        
        }
    
    }

    setGeoStyle({
        filter,
        itemStyle,
        label
    } = {}) {


        // special && special.forEach(region => {

        // const style = this._createGeoStyle(region.itemStyle, region.label);
        // this._regionsObj[region.name] = style;

        // });
        let regionObj = {};
        filter && filter.forEach(region => {

            const style = this._createGeoStyle(region.itemStyle, region.label);
            regionObj[region.name] = style;
        
        });
        this._regionsObj = regionObj;
        let vectorStyle = this.style._createGeoStyle(
            itemStyle || {},
            label || labelModel
        );
        this.layer.set('fstyle', vectorStyle);
    
    }

    /**
     * 设置允许下钻
     * @param {Boolean} flag  true/false
     */
    setGeoDrillDown(flag = false) {

        this.layer.set('geoDrillDown', flag);
        this.geoDrillDown = flag;
    
    }

    /**
     * 获取允许下钻状态
     * @return {Boolean} 
     */
    getGeoDrillDown() {

        return this.layer.get('geoDrillDown');
    
    }

    /**
     * 向下查询
     * @param  {Object} options [description]
     */
    geoGo({
        parentname,
        name
    } = {}) {

        this.geoLevel += 1; //当前数据的level+1;
        this.rollBackName = parentname;
        this.geoQuery({
            parentname: this.rollBackName,
            name: name,
            level: this.geoLevel
        },
            true
        );
    
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
        },
            true
        );
    
    }

    /**
     * 数据查询
     * @param  {Object}   options.level [description]
     * @param  {Object}   options.name  [description]
     * @param  {Boolean}  flag          [description]
     */
    geoQuery({
        level,
        name,
        parentname
    } = {}, flag = true) {

        const tableKey = this.geoTables[level];
        if (!tableKey) {

            return;
        
        }
        const table = 'area_china_' + tableKey;
        const column = 'parentname';
        const filter = ol.format.filter.equalTo(column, name);

        hyMapQuery.spatialQuery({
            url: this.url,
            msg: hyMapQuery.createFeatureRequest([table], filter),
            callback: features => {

                if (features.length > 0) {

                    this.geoQueryCallback(features, flag);
                
                } else {

                    this.geoLevel -= 1; //当前数据的level+1;
                    this.rollBackName = parentname;
                
                }
            
            }
        });
    
    }

    geoQueryCallback(features) {

        this.source.clear();
        this.source.addFeatures(features);
        //地图根据范围重新定位
        // flag && this.map.getView().fit(this.source.getExtent());
    
    }
}