import hymapOption from '../options/hymapOption';
import baseUtil from '../util/baseUtil';
import events from '../events/events';
import hylayers from '../layers/hylayers';
import animation from '../animation/animation';

const ol = require('../../public/lib/ol');

require('../../css/ol.css');
require('../../css/popup.css');

export default class hyMap extends hylayers {
    constructor(dom, options) {

        super(options);
        this._geo = hymapOption;
        this.map = null;
        this._show = true;
        this._overlay = null;
        this._event = [];
        this._showLogo = true;
        this._layersArray = new ol.Collection();
        this._layerGroup = new ol.layer.Group({
            zIndex: 5,
            layers: this._layersArray
        });
        this._addLayerGroupArray = {};
        this._markerLayer = [];

        this._panFunction = function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

        };

        this._init(dom);
        this.setOption(options);

    }


    /**
     * 初始化hymap对象
     * @param  {[type]} dom [description]
     * @return {[type]}     [description]
     */
    init(dom) {

        this.setDom(dom);

        return this;

    }

    /**
     * 设置属性
     * @param {[type]} opt_options [description]
     */
    setOption(opt_options) {

        if (!opt_options) {

            return;

        }
        baseUtil.merge(this._geo, opt_options || {}, true);
        //
        if (this._geo.show === true) {

            this.show();

        } else {

            this.hide();

        }

        this.clearSeries();
        this.setGeo(this._geo); //设置geo配置

        this.addSeries(this._geo.series, this._layersArray); //设置series
        this.setTheme(this._geo.theme); //设置theme主题
        this.setTooltip(opt_options.tooltip);

    }

    setGeo(geo) {

        this.setServerUrl(geo.serverUrl || this._geo.serverUrl);
        this.setView(geo);
        this.setGeoStyle(geo);
        this.setGeoSource(geo.map);

    }

    /**
     * 获取option对象
     * @return {[type]} [description]
     */
    getOption() {

        return this._geo;

    }

    /**
     * 设置map对应的容器
     * @param {[type]} dom [description]
     */
    setDom(dom) {

        if (dom) {

            this._dom = dom;
            this.map.setTarget(dom);

        }

    }

    /**
     * 获取map对应的dom容器
     * @return {[type]} [description]
     */
    getDom() {

        return this._dom;

    }

    /**
     * 内部初始化
     * @param  {[type]} dom [description]
     * @return {[type]}     [description]
     */
    _init(dom) {

        this._createMap();
        this._createBasicGroup();
        this._createGroupLayer();
        this.setDom(dom);

        this._createOverlay();
        this._createIntercation();

    }

    setServerUrl(url) {

        this._serverUrl = url;

    }

    getServerUrl() {

        return this._serverUrl;

    }

    /**
     * 创建map
     * @param  {[type]} dom [description]
     * @return {[type]}     [description]
     */
    _createMap() {

        this.map = new ol.Map({

            // target: ,
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }).extend([
                // new ol.control.FullScreen(),
                // new ol.control.MousePosition(),//鼠标位置
                // new ol.control.OverviewMap(),//鹰眼
                new ol.control.ScaleLine()
                // new ol.control.ZoomSlider(),//地图缩放侧边栏
                // new ol.control.ZoomToExtent()//一键缩放到全图
            ]),
            logo: this.getLogo()

        });

    }

    /**
     * 增加logo
     * @return {[type]} [description]
     */
    getLogo() {

        if (!this._showLogo) {

            return false;

        }

        let logoElement = document.createElement('a');
        logoElement.href = 'http://www.hydata.cc/';
        logoElement.target = '_blank';
        logoElement.className = 'ol-hy-logo';
        logoElement.innerHTML = '&copy; 2017 Haiyun data';
        return logoElement;

    }

    /**
     * 创建view
     * @return {[type]} [description]
     */
    setView({
        scaleLimit = [2, 18],
        roam = true,
        center = [118.62778784888256, 36.58892145091036],
        zoom = 3
    }) {

        let minZoom = scaleLimit[0];
        let maxZoom = scaleLimit[1];
        //限制缩放
        if (roam === 'false' || roam == 'pan') {

            minZoom = zoom;
            maxZoom = zoom;

        }
        //限制平移
        if (roam === 'false' || roam == 'scale') {

            this.map.on('pointerdrag', this._panFunction);

        } else {

            this.map.un('pointerdrag', this._panFunction);

        }
        this.view = new ol.View({
            center: center,
            zoom: zoom,
            enableRotation: false,
            minZoom: minZoom,
            maxZoom: maxZoom,
            projection: 'EPSG:4326'
                // extent: []

        });

        this.map.setView(this.view);
        this.map.on('pointermove', function(evt) {

            evt.map.getTargetElement().style.cursor = evt.map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';

        }, this);

    }

    _createIntercation() {

        this._createHoverInteraction();
        this._createSelectInteraction();

    }

    /**
     * 创建图层组
     * @return {[type]} [description]
     */
    _createGroupLayer() {

        this.map.addLayer(this._layerGroup);

    }

    _createLayer(id) {

        let layersArray = new ol.Collection();
        let layerGroup = new ol.layer.Group({
            layers: layersArray,
            id: id
        });
        this._addLayerGroupArray[id] = layerGroup;
        this.map.addLayer(layerGroup);
        return layerGroup;

    }

    addLayer(layer) {

        const id = layer.id;
        const layerGroup = this._createLayer(id);
        this.addSeries(layer.series, layerGroup.getLayers());

    }

    removeLayer(id) {


        const group = this._addLayerGroupArray[id];
        console.log(group)
        if (group) {

            this.map.removeLayer(group);
            delete this._addLayerGroupArray[id];

        }

    }

    /**
     * 创建图层数组
     * @param  {[type]} series [description]
     * @return {[type]}        [description]
     */
    addSeries(series, layersArray) {

        series.forEach((a) => {

            this.addSerie(a, layersArray);

        });

    }

    /**
     * 创建图层
     * @param  {[type]} serie [description]
     * @return {[type]}       [description]
     */
    addSerie(serie, layersArray) {

        const data = serie.data;
        let array = [];

        if (serie.type == 'chart') {

            data.forEach(obj => {

                let rootDiv = document.createElement('div');
                rootDiv.id = obj.id;
                rootDiv.appendChild(obj.container);
                document.body.appendChild(rootDiv);
                const marker = new ol.Overlay({
                    position: this._createGeometry(serie.type, obj),
                    positioning: 'center-center',
                    element: rootDiv,
                    stopEvent: false,
                    id: serie.id
                });

                this._markerLayer.push(marker);
                this.map.addOverlay(marker);

            });


        } else {

            let source = new ol.source.Vector();
            source.on('addfeature', function(evt) {

                evt.feature.source = source;

            });

            let vector = new ol.layer.Vector({
                source: source,
                style: this._geoStyleFn,
                id: serie.id || ''
            });

            vector.set('type', 'item');
            vector.set('showPopup', serie.showPopup);
            source.vector = vector;
            const style = this._createFeatureStyle(serie);
            vector.set('fstyle', style);

            layersArray.push(vector);

            data.forEach((obj) => {

                let feature = new ol.Feature({
                    geometry: this._createGeometry(serie.type, obj),
                    dataIndex: new Date().getTime()

                });
                feature.setProperties(obj);
                feature.setId(obj.id);
                // const featurestyle = this._createGeoStyle(serie.itemStyle, serie.label);
                // feature.set('style', featurestyle);
                array.push(feature);

            });
            source.addFeatures(array);

        }

    }
    _removeSerie(id) {

        this._markerLayer.forEach(obj => {

            const key = obj.get('id');
            if (key == id) {

                this.map.removeOverlay(obj);
                return;

            }

        });

        this._layersArray.forEach(obj => {

            const key = obj.get('id');
            if (key == id) {

                this._layersArray.remove(obj);
                return;

            }

        });

    }

    removeSeries(id) {

        if (id) {

            if (baseUtil.isArray(id)) {

                id.forEach(obj => {

                    this._removeSerie(obj);

                });

            } else {

                this._removeSerie(id);

            }


        } else {

            this.clearSeries();

        }


    }


    clearSeries() {

        this._layersArray.clear();
        this._removeMarkerOverlay();

    }


    /**
     * 创建空间对象
     * @param  {[type]} type [description]
     * @param  {[type]} obj  [description]
     * @return {[type]}      [description]
     */
    _createGeometry(type, obj) {

        let geometry = null;
        if (type == 'point') {

            geometry = new ol.geom.Point(obj['geoCoord']);

        } else if (type == 'line') {

            let coords = [];
            const str = obj.xys.split(';');
            str.forEach(function(obj) {

                const coord = obj.split(',');
                coords.push(coord);

            });

            geometry = new ol.geom.LineString(coords);


        } else if (type == 'polygon') {

            let coords = [];
            const str = obj.xys.split(';');
            str.forEach(function(obj) {

                const coord = obj.split(',');
                coords.push(coord);

            });

            geometry = new ol.geom.LineString(coords);

        } else if (type == 'chart') {

            return obj['geoCoord'];

        }
        return geometry;

    }


    /**
     * [dispatchAction description]
     * @param  {[type]} evt [description]
     * @return {[type]}     [description]
     */
    dispatchAction(evt) {

        var feature = this.getFeature(evt.id);
        const geoType = this.geoType_[evt.type]['arrayType'];
        let e = {
            'type': 'select',
            [geoType]: [feature]
        };
        this.clickSelect.dispatchEvent(e);


    }

    getFeature(id) {

        const layers = this._layerGroup.getLayers();
        let feature = null;
        layers.forEach(function(element) {

            feature = element.getSource().getFeatureById(id);

        });
        return feature;


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

    /**
     * [resize description]
     * @return {[type]} [description]
     */
    resize() {

        this.map.updateSize();

    }

    /**
     * [flyto description]
     * @return {[type]} [description]
     */
    flyto({
        geoCoord,
        animateDuration = 2000,
        zoom = 5,
        animateEasing = ''
    }, callback) {

        var geometry = new ol.geom.Point(ol.proj.fromLonLat(geoCoord, this.map.getView().getProjection()));
        var animate = new animation(this.map, geometry, zoom, animateDuration);
        zoom === 5 ? animate.centerAndZoom() : animate.flyTo();
        if (callback && typeof callback == 'function') {

            callback();

        }

    }

    /**
     * 销毁对象
     * @return {[type]} [description]
     */
    dispose() {

        this.map.dispose();
        return null;

    }

    nullFunction() {

    }
}

Object.assign(hyMap.prototype, events);