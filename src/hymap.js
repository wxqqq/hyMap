const ol = require('openlayers/dist/ol-debug');
const olstyle = require('openlayers/dist/ol.css');

export default class hyMap {
    constructor(dom) {

        this.geoserverUrl = 'http://192.168.0.50:8080/geoserver/wms';
        this._createMap(dom);
        this._dom = null;
        this._show = true;

    }

    init(dom) {

        if (!dom) {

            throw new Error('Initialize failed: invalid dom.');

        }
        this._dom = dom;
        this._createMap(dom);

        // var hymap = new hyMap(dom);
        // return hymap;

    }

    /**
     * 创建map
     * @param  {[type]} dom [description]
     * @return {[type]}     [description]
     */
    _createMap(dom) {


        this.map = new ol.Map({

            target: dom,
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            })

        });

    }

    /**
     * 创建vieww
     * @return {[type]} [description]
     */
    _createView() {

        var view = new ol.View({
            center: this._geo.center,
            zoom: this._geo.zoom,
            minZoom: this._geo.scaleLimit[0],
            maxZoom: this._geo.scaleLimit[1],
            projection: 'EPSG:4326'
                // resolutions: [0.005767822265625, 0.00494384765625,
                //     0.004119873046875, 0.0020599365234375, 0.00102996826171875,
                //     0.000514984130859375, 0.0002574920654296875, 0.00012874603271484375
                // ]
        });
        this.map.setView(view);

    }

    _createBasicLayer() {

        const wmsSource = new ol.source.TileWMS({
            url: this.geoserverUrl,
            params: {
                'LAYERS': 'csdlzxx_pl'
            },
            serverTyjpe: 'geoserver',
            crossOrigin: 'anonymous'
        });
        this.wmsTile = new ol.layer.Tile({
            source: wmsSource
        });
        this.map.addLayer(new ol.layer.Tile({
            source: new ol.source.OSM()
        }));
        this.map.addLayer(new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: this.geoserverUrl,
                params: {
                    'LAYERS': 'xzqh'
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            })
        }));
        this.map.addLayer(new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: this.geoserverUrl,
                params: {
                    'LAYERS': 'hygis:xzqhbz_pt'
                },
                serverTyjpe: 'geoserver',
                crossOrigin: 'anonymous'
            })
        }));
        this.map.addLayer(this.wmsTile);

    }

    _createLayer(serie) {


        let style;
        const data = serie.data;
        let icon;
        if (serie.type == 'point') {

            if (serie.symbol == 'circle') {

                icon = new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,255,255,1)',
                        width: 1
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(0,255,255,0.3)'
                    })
                });

            } else {

                const canvas = document.createElement('canvas');

                let ctx = canvas.getContext('2d');
                let img = new Image();
                img.src = serie.symbol.split(':')[1];

                img.onload = function() {

                    ctx.drawImage(img, 0, 0, serie.symbolStyle.normal.width, serie.symbolStyle.normal.height);

                };
                canvas.setAttribute('width', serie.symbolStyle.normal.width);
                canvas.setAttribute('height', serie.symbolStyle.normal.height);
                icon = new ol.style.Icon({
                    anchor: [0.5, 1],
                    img: canvas,
                    imgSize: [canvas.width, canvas.height]
                });

            }


        }

        style = new ol.style.Style({
            image: icon
        });

        let array = [];
        for (var i = 0; i < data.length; i++) {

            var obj = data[i];
            var feature = new ol.Feature({
                geometry: new ol.geom.Point([obj['lon'], obj['lat']])

            });
            feature.setProperties(obj);

            array.push(feature);

        }
        let source = new ol.source.Vector();
        source.addFeatures(array);
        let vector = new ol.layer.Vector({
            source: source,
            style: function() {

                return style;

            }

        });

        this.map.addLayer(vector);


    }

    _createLayers(series) {

        series.forEach(function(a) {

            this._createLayer(a);

        }, this);

    }
    setOption(opt_options) {

        const options = opt_options || {};
        this._geo = options;
        this._geo.show = options.show || options.show === false ? options.show : true;
        this._geo.map = options.map;
        this._geo.roam = options.roam;
        this._geo.center = options.center;
        this._geo.zoom = options.zoom;
        this._geo.scaleLimit = options.scaleLimit;
        this._geo.itemStyle = options.itemStyle;
        this._geo.selectedMode = options.selectedMode;
        this._geo.theme = options.theme;
        this._geo.regions = options.regions;
        this._geo.label = options.label;
        this._geo.series = options.series;
        console.log(this._geo.series);
        this._show = this._geo.show;
        //
        if (this._geo.show === true) {

            this.show();

        } else {

            this.hide();

        }
        this._createView();
        this._createBasicLayer();
        this._createLayers(this._geo.series);


    }
    on() {

    }
    off() {

    }
    dispatchAction() {

    }
    addPoints() {

    }
    disponse() {

    }
    flyTo() {

    }

    /**
     * dom状态切换（显示，隐藏）
     * @return {[type]} [description]
     */
    tollgeShow() {

        if (this._show === false) {

            this._dom.style.display = 'block';

        } else {

            this._dom.style.display = 'none';

        }

    }

    /**
     * 隐藏dom对象
     * @return {[type]} [description]
     */
    hide() {

        this._dom.style.display = 'none';
        this._show = false;

    }

    /**
     * 显示dom对象
     * @return {[type]} [description]
     */
    show() {

        this._dom.style.display = 'block';
        this._show = true;

    }
}