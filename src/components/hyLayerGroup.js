/*
 * @Author: wxq
 * @Date:   2017-05-04 17:22:04
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-15 17:49:19
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\hyLayerGroup.js
 * @File Name: hyLayerGroup.js
 * @Descript: 
 */
'use strict';
import baseUtil from '../util/baseUtil';
import serieModel from '../model/serieModel';
import hyMapStyle from './style/hyMapStyle';
import hyFeature from './feature/hyFeature';
import events from '../events/events';
import hyLayer from '../components/layer/hyLayer';

const ol = require('ol');

export default class hyLayerGroup extends hyMapStyle {
    constructor(options) {

        super(options);
        this.map = options.map;
        this.layersArray = new ol.Collection();
        this.layerGroup = this._createGroup(options.id, options.name);
        this.addSeries(options.series, this.layersArray);

    }

    getLayers() {

        return this.layerGroup.getLayers();

    }
    get(id) {

        return this.layerGroup.get(id);

    }
    setVisible(flag = true) {

        this.layerGroup.setVisible(flag);

    }
    _createGroup(id, name) {

        this.layersArray.set('layerId', id);

        let layerGroup = new ol.layer.Group({
            layers: this.layersArray,
            id: id,
            name: name || id
        });
        this.layersArray.parent = layerGroup;
        this.layersArray.on('add', (evt) => {

            evt.element.set('layerId', evt.target.get('layerId'));
            evt.element.parent = this.layersArray;

        });
        return layerGroup;

    }

    update(options) {

        const layerGroup = this.layerGroup;
        if (!layerGroup) {

            console.info('未找到对应数据。');
            return;

        }
        const series = options.series; //新数据
        const newSeriesLength = series.length; //新数据长度

        const layers = layerGroup.getLayers(); //旧数据
        const old_layersLength = layers.getLength(); //旧数据长度

        layers.forEach((layer, index) => {

            let serie = series[index]; //新的数据
            let newserie = baseUtil.clone(serieModel);
            baseUtil.merge(newserie, serie, true);
            serie = newserie;
            //找到新数据的条目进行数据处理，未找到的情况下删除已存在的layer
            if (serie) {

                const oldSerie = layer.get('serie');
                if (oldSerie.cluster.enable != serie.cluster.enable ||
                    oldSerie.animation.enable !== serie.animation.enable ||
                    (oldSerie.type != serie.type && (oldSerie.type == 'hetamap' || serie.type == 'heatmap'))) {

                    const vector = new hyLayer({
                        map: this.map,
                        serie: serie
                    });
                    layers.setAt(index, vector.layer);
                    // console.log('update_changeOption');

                } else {

                    const style = this._createFeatureStyle(serie);
                    layer.set('fstyle', style);
                    layer.set('serie', serie);
                    const data = serie.data;
                    let source = layer.getSource();
                    //聚合图层的source为两层，进行判断获取到最底层的source
                    if (source instanceof ol.layer.AnimatedCluster) {

                        source = source.getSource();

                    }


                    let addData = [];
                    let updateData = new Map();
                    let strMap = new Map();

                    for (let k of Object.keys(data)) {

                        strMap.set('serie|' + data[k].geoCoord, data[k]);

                    }
                    //目标数据遍历，找到的更新，未找到的删除。
                    source.forEachFeature(function(feature) {

                        const geoCoord = feature.getId();
                        if (strMap.has(geoCoord)) {

                            const value = strMap.get(geoCoord);
                            feature.setProperties(value);
                            updateData.set('serie|' + value.geoCoord, value);

                        } else {

                            // console.log('update_rmData', feature);
                            source.removeFeature(feature);

                        }

                    });
                    //找到的数据进行更新，未找到的准备新增。

                    data.map((value) => {

                        if (!updateData.has(value.geoCoord)) {

                            addData.push(value);

                        }

                    });

                    //增加数据.
                    if (addData.length > 0) {

                        const featuresObj = hyFeature.getFeatures(addData, serie.type);
                        //获取feature数组
                        const array = featuresObj.features;
                        layer.getSource().addFeatures(array);

                    }

                }

            }

        });

        //如果新数据的长度比旧数据长，增加layer
        if (newSeriesLength > old_layersLength) {

            for (let i = old_layersLength; i < newSeriesLength; i++) {

                // console.log('update_addSerie');
                this.addSerie(series[i], layers);

            }

        }
        if (newSeriesLength < old_layersLength) {

            for (let i = newSeriesLength; i < old_layersLength; i++) {

                // console.log('update_rmSerie')
                layers.removeAt(series.length);

            }

        }

    }

    /**
     * 创建图层数组
     * @param  {[type]} series [description]
     * @return {[type]}        [description]
     */
    addSeries(series, layersArray) {

        series.forEach((serie) => {

            this.addSerie(serie, layersArray);

        });

    }
    addSerie(serie, layersArray) {

        const vector = new hyLayer({
            map: this.map,
            serie: serie
        });
        vector && layersArray.push(vector.layer);

    }
}

Object.assign(hyLayerGroup.prototype, events);