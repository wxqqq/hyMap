var ol = require('openlayers/dist/ol.js');
var olstyle = require('openlayers/dist/ol.css');

export default class hymap {
    constructor(options) {


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
                    console.log(this);
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
                        zoom: 3,
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

                _createLayer(options) {

                    console.log(a)
                    var style = new ol.style.Style({
                        image: new ol.style.Icon({
                            image: options.symbol
                        })
                    })
                    var layer = new ol.layer.Vector({
                        source: new ol.source.Vector({}),
                        style: function(feature) {
                            return style;
                        }
                    });

                }
                _createLayers(series) {
                    series.foreach(a => _createLayer(a));
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
                    console.log(this._geo.series)
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

                    if (this._show === true) {

                        this._dom.style.display = 'block';
                        this._show = false;

                    } else {

                        this._dom.style.display = 'none';
                        this._show = true;

                    }

                }

                /**
                 * 隐藏dom对象
                 * @return {[type]} [description]
                 */
                hide() {

                    this._dom.style.display = 'none';

                }

                /**
                 * 显示dom对象
                 * @return {[type]} [description]
                 */
                show() {

                    this._dom.style.display = 'block';

                }
            }