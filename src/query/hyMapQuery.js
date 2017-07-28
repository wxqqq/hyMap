'use strict';

const ol = require('ol');

export default class hyMapQuery {
    /**
     * 初始化
     */
    constructor() {}

    /**
     * 创建空间过滤
     * @param  {geometry}   geometry  空间对象
     * @return {filter}      filter   过滤条件
     */
    static spatialFilter(geometry) {

        return ol.format.filter.intersects('geom', geometry.clone().transform(this._projection, 'EPSG:4326'), 'urn:x-ogc:def:crs:EPSG:4326');

    }

    /**
     * 创建请求串
     * @param  {array} tables 表名
     * @param  {filter} filter  过滤对象
     * @return {string}  string xml请求串
     */

    static createFeatureRequest(tables, filter, projection = 'EPSG:3857') {

        const featureRequest = new ol.format.WFS().writeGetFeature({
            srsName: projection,
            featureNS: 'http://www.hygis.com/hygis',
            featureTypes: tables,
            filter: filter,
            outputFormat: 'application/json'

        // filter: ol.format.filter.and(
        //     ol.format.filter.like('name', 'Mississippi*'),
        //     ol.format.filter.equalTo('waterway', 'riverbank')
        // )
        });
        return new XMLSerializer().serializeToString(featureRequest);

    }

    /**
     * 空间查询
     * @param  {Object}   options 参数
     */
    static spatialQuery(options) {

        fetch(options.url + '/wfs', {
            method: 'POST',
            body: options.msg
        }).then(function(response) {

            return response.json();

        }).then(function(json) {

            options.callback(new ol.format.GeoJSON().readFeatures(json));

        }).catch(function(e) {

            console.info(e);
            options.callback({});

        });

    }
}