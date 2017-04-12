const ol = require('../../public/lib/ol');

export default class hyMapQuery {
    constructor() {

    }

    static spatialFilter(geometry) {

        return ol.format.filter.intersects('geom', geometry.clone().transform(this._projection, 'EPSG:4326'), 'urn:x-ogc:def:crs:EPSG:4326');

    }

    /**
     * [createFeatureRequest description]
     * @param  {[type]} tables [description]
     * @param  {[type]} filter [description]
     * @return {[type]}        [description]
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
     * [spatialQuery description]
     * @param  {[type]}   featureRequest [description]
     * @param  {Function} callback       [description]
     * @return {[type]}                  [description]
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

            options.callback({});

        });

    }

    /**
     * [areaQuery description]
     * @author WXQ
     * @date   2017-04-12
     * @param  {[type]}   options {geom,layers}
     * @return {[type]}           [description]
     */
    static areaQuery(options) {

        const geom = options.geom;
        let result = {};
        const layers = options.layers;

        for (let key in layers) {

            const group = layers[key];


            const childLayers = group.getLayers();
            let series = [];
            result[group.get('id')] = series;
            childLayers.forEach(function(layer) {


                layer.getSource().getFeatures().forEach(function(feature) {

                    const coord = feature.getGeometry().getCoordinates();
                    if (geom.intersectsCoordinate(coord)) {

                        series.push(feature);

                    }

                });

            });

        }

        return result;

    }
}