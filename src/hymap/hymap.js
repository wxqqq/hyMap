import hymapOption from '../model/mapModel';
import hyLayerGroup from '../components/hyLayerGroup';
import baseUtil from '../util/baseUtil';
import events from '../events/events';
import hymap from '../components/map';
import animation from '../animation/animation';
import mapTool from '../util/mapToolUtil';
import gpsLayer from '../components/layer/gpsLayer';
import hyView from '../components/view';
import hyMeasure from '../components/tools/hyMeasure';
import trackLayer from '../components/layer/trackLayer';
import circleQueryLayer from '../components/layer/circelQueryLayer';
import baseMap from '../components/layer/baseMap';
import baseGeo from '../components/layer/baseGeo';
import hytooltip from '../components/tooltip/hytooltip';

const ol = require('ol');
/**
 * 
 */
export default class hyMap extends hytooltip {
    constructor(dom, options) {

        super(options);
        this._basicLayersArray = new ol.Collection();
        this._basicLayerGroup = new ol.layer.Group();
        this._basicLayerGroup.setLayers(this._basicLayersArray);
        this._geo = hymapOption;
        this.map = null;
        this._show = true;
        this._overlay = null;
        this._event = [];
        this._showLogo = true;
        this._addLayerGroupArray = {};
        this._markerLayer = {};

        this._panFunction = function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

        };

        this._init(dom);
        this.setOption(options);
        this.duration = 4000;
        animation._intervaldate = new Date().getTime();
        this.spliceElapsed = 0;

        this.trackOverlayArray = [];
        this.postListenerObj = {};

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

        this.setServerUrl(this._geo.serverUrl);
        this.setGeo(this._geo); //设置geo配置
        this.setView(this._geo);
        this.setTooltip(opt_options.tooltip);
        this.addLayer({
            series: this._geo.series
        }); //设置series

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
            dom.tabIndex = 0;
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

            this.map = new hymap();
            mapTool.map = this.map;
            this._createBasicGroup();
            this.setDom(dom);

            this._overlay = this._createOverlay();
            this._createIntercation();
            this._createtrackLayer();

            // this.hymeasure = new hyMeasure({
            // map: this.map
            // })

        }
        /**
         * 创建基础图层组
         * @return {[type]} [description]
         */
    _createBasicGroup() {

        //底图
        this.baseLayer = new baseMap({});
        this._basicLayersArray.push(this.baseLayer.getLayer());
        this.baseGeoObject = new baseGeo();
        this._basicLayersArray.push(this.baseGeoObject.getLayer());

        this.map.addLayer(this._basicLayerGroup);
        // this.map.addLayer(this.baseLayer.getLayer());
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

    }

    showBaseMap() {

        this.baseLayer.show();

    }

    hideBaseMap() {

        this.baseLayer.hide();

    }

    /**
     * [setTheme description]
     * @param {String} theme [description]
     */
    setTheme(theme) {

        this.baseLayer.setUrl(this._serverUrl);
        this.baseLayer.setTheme(theme);

    }
    setGeo(geo) {

        this.baseGeoObject.setUrl(geo.serverUrl);
        this.baseGeoObject.setGeoStyle(geo);
        this.baseGeoObject.setGeoSource(geo.map);
        this.baseGeoObject.setGeoDrillDown(geo.drillDown);
        this.setTheme(geo.theme); //设置theme主题

    }

    showGeo() {

        this.baseGeoObject.show();

    }

    hideGeo() {

        this.baseGeoObject.hide();

    }

    /**
     * [setDrillDown description]
     * @param {Boolean} flag [description]
     */
    setGeoDrillDown(flag = false) {

        this.baseGeoObject.setGeoDrillDown(flag);

    }

    /**
     * [getDrillDown description]
     * @return {[type]} [description]
     */
    getGeoDrillDown() {

        return this.baseGeoObject.getGeoDrillDown();

    }

    /**
     * [geoGo description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    geoGo(options) {

        this.baseGeoObject.geoGo(options);

    }

    geoGoBack() {

        this.baseGeoObject.geoGoBack();

    }

    /**
     * [geoQuery description]
     * @param  {[type]} prototype{level,name,} [description]
     * @return {[type]}        [description]
     */
    geoQuery(options, flag = true) {

        this.baseGeoObject.geoQuery(options, flag);


    }

    geoQueryCallback(features, flag) {

        this.baseGeoObject.geoQueryCallback(features, flag);

    }
    setServerUrl(url) {

        this._serverUrl = url;

    }

    getServerUrl() {

        return this._serverUrl;

    }

    /**
     * 创建view
     * @return {[type]} [description]
     */
    setView(geo) {


        this.view = new hyView(geo, this.map);
        this.map.setView(this.view);

        this.view.on('change:resolution', (evt) => {

            if (this.map.getView().getZoom() > 8) {

                // this.hideGeo();

            } else {

                // this.showGeo();

            }

        });


    }
    setCenter(coord) {

        this.view.setCenter(mapTool.transform(coord));

    }
    _createIntercation() {

        this._createHoverInteraction();
        this._createSelectInteraction();

    }
    measure(type) {

        this.hymeasure.active(type);

    }

    addLayer(layer) {

        layer.id = layer.id || new Date().getTime();
        layer.map = this.map;
        const layerGroup = new hyLayerGroup(layer);
        this._addLayerGroupArray[layer.id] = layerGroup;
        this.map.addLayer(layerGroup.layerGroup);

        return layerGroup.layerGroup;

    }

    updateLayer(options) {

        const id = options.id || null;
        const layerGroup = this._addLayerGroupArray[id]; //获取对应的layergroup
        if (!layerGroup) {

            console.info('未找到对应数据。', id);
            return;

        }
        this.clickSelect.getFeatures().clear();
        layerGroup.update(options);

    }

    removeLayer(id) {


        const group = this._addLayerGroupArray[id];
        if (group) {

            this.map.removeLayer(group.layerGroup);
            delete this._addLayerGroupArray[id];

        }

    }

    hasLayer(id) {

        const group = this._addLayerGroupArray[id];
        if (group) {

            return true;

        }
        return false;

    }

    showLayer(id) {

        const group = this._addLayerGroupArray[id];
        if (group) {

            group.setVisible(true);

        }


    }

    hideLayer(id) {

        const group = this._addLayerGroupArray[id];
        if (group) {

            group.setVisible(false);

        }


    }



    addMarkers(data) {

        data.forEach(obj => {

            this.addOverlay(obj);

        });

    }

    /**
     * [addOverlay description]
     * @author WXQ
     * @date   2017-06-02
     * @param  {[type]}    // { id, container, linewidth,geoCoord,showLine,offset,positioning}
     */
    addOverlay(obj) {

        let marker = this._markerLayer[obj.id];
        obj.container.style.position = 'static';
        obj.container.style.float = 'left';
        if (marker) {

            marker.setPosition(mapTool.transform(obj.geoCoord));
            marker.setElement(obj.container);

        } else {

            marker = new ol.Overlay({
                position: mapTool.transform(obj.geoCoord),
                positioning: obj.positioning || 'center-center',
                offset: obj.offset,
                element: obj.container,
                stopEvent: false,
                id: obj.id
            });



            this._markerLayer[obj.id] = marker;

            this.map.addOverlay(marker);
            if (obj.showLine) {

                let lineWidth = obj.lineWidth || 80;
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                // canvas.style.float = 'right';
                canvas.width = lineWidth;
                canvas.height = obj.container.offsetHeight;
                ctx.strokeStyle = 'white';
                ctx.moveTo(lineWidth, canvas.height);
                let tmpX = lineWidth / 2;
                ctx.lineTo(tmpX, 6);
                ctx.lineTo(0, 6);
                ctx.stroke();
                obj.container.parentNode.appendChild(canvas);

            }

        }
        marker.set('geoCoord', obj.geoCoord);
        return marker;

    }



    removeOverlay(marker) {

        if (!(marker instanceof ol.Overlay)) {

            marker = this._markerLayer[marker];

        }
        if (marker) {

            this.map.removeOverlay(marker);
            delete this._markerLayer[marker.getId()];

        }


    }

    removeOverlays() {

        for (let id in this._markerLayer) {

            const marker = this._markerLayer[id];
            this.map.removeOverlay(marker);

        }

    }

    showOverlay(id) {

        const marker = this._markerLayer[id];
        marker && marker.setPosition(mapTool.transform(marker.get('geoCoord')));

    }

    hideOverlay(id) {

        const marker = this._markerLayer[id];
        marker && marker.setPosition();

    }

    /**
     * [_removeSerie description]
     * @author WXQ
     * @date   2017-03-22
     * @param  {[type]}   id [description]
     * @return {[type]}      [description]
     */
    _removeSerie(id) {

        const marker = this._markerLayer[id];
        if (marker) {

            this.removeOverlay(marker);

        }

        for (let group in this._addLayerGroupArray) {

            this._addLayerGroupArray(group).forEach(obj => {

                const key = obj.get('id');
                if (key == id) {

                    group.remove(obj);
                    return;

                }

            });

        }


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

            this.removeLayers();

        }

    }


    removeLayers() {

        for (let group in this._addLayerGroupArray) {

            this.removeLayer(group);

        }

        this._addLayerGroupArray = {};

    }



    /**
     * [dispatchAction description]
     * @param  {[type]} evt [description]
     * @return {[type]}     [description]
     */
    dispatchAction(evt) {

        let feature = this.getFeature(evt.id);
        const geoType = this.geoType_[evt.type]['arrayType'];
        let e = {
            'type': 'select',
            [geoType]: [feature]
        };
        this.clickSelect.dispatchEvent(e);

    }

    getFeature(id) {

        const layersGroup = this.map.getLayers();
        let feature = null;
        layersGroup.forEach((group) => {

            if (group instanceof ol.layer.Group) {

                const layers = group.getLayers();
                layers.forEach(function(element) {

                    if (element.getSource() instanceof ol.source.Vector) {

                        feature = element.getSource().forEachFeature((feature) => {

                            feature.get('id') == id;
                            return feature;

                        });

                    }

                });

            }

        });
        return feature;


    }

    /**
     * [getFeaturesByProperty description]
     * @author WXQ
     * @date   2017-06-07
     * @param  {[type]}   key   [description]
     * @param  {[type]}   value [description]
     * @return {[type]}         [description]
     */
    getFeaturesByProperty(key, value) {

        const layersGroup = this.map.getLayers();
        let array = [];
        layersGroup.forEach((group) => {

            const layers = group.getLayers();
            layers.forEach((element) => {

                if (element.getSource() instanceof ol.source.Vector) {

                    const features = element.getSource().getFeatures();

                    features && features.forEach((feature) => {

                        if (feature.get(key) && feature.get(key) == value) {

                            const pixel = mapTool.getPixelFromCoords(feature.getGeometry().getCoordinates());
                            array.push({
                                pixel: pixel,
                                // properties: feature.getProperties()
                                properties: feature
                            });

                        }

                    });

                }

            });

        });
        return array;

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
    flyTo(geoCoord, {
        animateDuration = 2000,
        zoom = undefined,
        animateEasing = '',
        callback = undefined
    } = {}) {

        let geometry = geoCoord;
        if (!(geoCoord instanceof ol.geom.Geometry)) {

            geometry = new ol.geom.Point(mapTool.transform(geoCoord, this.map.getView().getProjection()));

        }
        if (zoom) {

            let animate = new animation(this.map, geometry, zoom, animateDuration);
            zoom === 5 ? animate.centerAndZoom() : animate.flyTo(callback);

        } else {

            this.view.fit(geometry.getExtent(), {
                duration: animateDuration

            });
            if (callback && typeof callback == 'function') {

                callback();

            }

        }

    }

    /**
     * [areaQuery description]
     * @author WXQ
     * @date   2017-04-12
     * @param  {[type]}   options {geom,layers}
     * @return {[type]}           [description]
     */
    areaQuery(options) {

        console.log(this.clickSelect.getFeatures())
        this.clickSelect.getFeatures().clear();
        const geom = options.geom;
        let result = {};
        const groupLayers = options.layers;

        for (let key in groupLayers) {

            const group = groupLayers[key];

            const layers = group.getLayers();
            let array = [];
            result[group.get('id')] = array;

            layers.forEach((layer) => {

                let featureArray = [];
                layer.getSource().forEachFeature((feature) => {

                    const coords = feature.getGeometry().getCoordinates();
                    if (geom.intersectsCoordinate(coords)) {

                        //增加距离，单位为米
                        var line = new ol.geom.LineString([coords, geom.getCenter()]);
                        feature.set('pixel', this.map.getPixelFromCoordinate(coords));
                        feature.set('distance', Number(line.getLength().toFixed(0)));
                        featureArray.push(feature);
                        this.clickSelect.getFeatures().push(feature);

                    }

                });

                featureArray = this.sortBy(featureArray, 'distance');
                array.push(featureArray);
            });

        }

        return new Promise(function(resolve, resject) {

            resolve(result);

        });

    }

    sortBy(array, key) {

        array.sort((a, b) => {

            return a.get('distance') - b.get('distance');

        });
        return array;

    }

    /**
     * 创建视频链接线
     * @author WXQ
     * @date   2017-06-02
     * @param  {[type]}   obj 对象体
     * @return {[type]}    对象内部id
     */
    drawCable(obj) {

        let listererObj = this.map.on('postcompose', (evt) => {

            let ctx = evt.context;
            let piex = this.map.getPixelFromCoordinate(mapTool.transform(obj.geoCoord));
            const tmpX = piex[0] > obj.end[0] ? piex[0] - 100 : piex[0] + 100;
            ctx.strokeStyle = obj.color || 'red';
            ctx.moveTo(piex[0], piex[1]);
            ctx.lineTo(tmpX, obj.end[1]);
            ctx.lineTo(obj.end[0], obj.end[1]);
            ctx.stroke();

        });
        let id = obj.id || new Date().getTime();
        this.postListenerObj[id] = listererObj;
        return id;

    }

    /**
     * 更新连接线
     * @author WXQ
     * @date   2017-06-02
     * @param  {[type]}   obj [description]
     * @return {[type]}       [description]
     */
    updateCable(obj) {

        this.removeCable(obj.id);
        this.drawCable(obj);

    }

    /**
     * 删除连接线
     * @author WXQ
     * @date   2017-06-02
     * @param  {[type]}   id [description]
     * @return {[type]}      [description]
     */
    removeCable(id) {

        const listererObj = this.postListenerObj[id];
        this.map.un('postcompose', listererObj.listener);
        delete this.postListenerObj[id];

    }

    /**
     * 空间查询
     * @author WXQ
     * @date   2017-06-02
     * @param  {[type]}   geoCoord [description]
     * @param  {[type]}   radius   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    spatialQuery(geoCoord, radius, callback) {

        this.clearTrackInfo(); //该方法进行对查询到的所有轨迹和tooltip进行移除操作。

        this.clearSpatial();
        this.queryCircle.setQueryFun((result) => {

            this.areaQuery({
                geom: result.geometry,
                layers: this._addLayerGroupArray
            }).then((data) => {

                this.clearTrackInfo();

                result.data = data;
                if (baseUtil.isFunction(callback)) {

                    callback(result);

                }

            });

        });

        this.queryCircle.load(geoCoord, radius);

    }

    clearSpatial() {

        this.queryCircle.clear();
        this.clickSelect.getFeatures().clear();

    }

    drawTrack(start, end, {
        callback = undefined,
        tooltipFun = undefined,
        isCustom = false
    } = {}) {

        if (!start) {

            return;

        }
        //起始点一致，不进行查询
        if (start.toString() == end.toString()) {

            return;

        }

        let url = 'http://localhost:3000/routing';
        const viewparams = ['x1:' + start[0], 'y1:' + start[1], 'x2:' + end[0], 'y2:' + end[1]];
        url = this._serverUrl + '/hygis/wfs?sversion=1.0.0&request=GetFeature&outputFormat=application%2Fjson';
        url += '&typeName=' + 'routing_sd_jining' + '&viewparams=' + viewparams.join(';');

        // let formData = new FormData();
        // formData.append("start", start);
        // formData.append("end", new ol.format.WKT().writeGeometry(end.getGeometry()));

        // let data = JSON.stringify({
        // start: start,
        // end: new ol.format.WKT().writeGeometry(end.getGeometry().clone().transform('EPSG:3857', "EPSG:4326"))
        // });
        fetch(url, {
            // mode: "cors",
            // headers: {
            // "Content-Type": "application/x-www-form-urlencoded",
            // 'Content-Type': 'application/json'
            // },
            // method: 'POST',
            // body: data

        }).then((response) => {

            return response.json();

        }).then((data) => {

            var features = new ol.format.GeoJSON().readFeatures(data, {
                featureProjection: 'EPSG:3857'
            });
            if (baseUtil.isFunction(callback)) {

                callback(features[0]);

            }

            this.trackLayer.getSource().addFeatures(features);

            if (tooltipFun) {

                const geometry = features[0].getGeometry().clone();
                const length = geometry.getLength();

                const time = Math.ceil(length / 1000 * 60 / 60);
                let overlay = this._createTrackOverLay(start, null, isCustom);
                let str = baseUtil.isFunction(tooltipFun) ? tooltipFun({
                    length,
                    time
                }, overlay.getElement()) : tooltipFun;

            }

        }).catch(function(e) {

            console.log(e);

        });

    }

    _createTrackOverLay(coordinate, content, isCustom) {

        let d;
        if (isCustom) {

            d = document.createElement('div');

        }

        let overlay = this._createOverlay(d);
        let div = overlay.getElement();
        if (baseUtil.isDom(content)) {

            div.appendChild(content);

        } else {

            div.innerHTML = content;

        }

        overlay.setPosition(mapTool.transform(coordinate));
        this.trackOverlayArray.push(overlay);
        return overlay;

    }

    _createtrackLayer() {

        this.queryCircle = new circleQueryLayer({
            map: this.map
        });

        this.queryCircleLayer = this.queryCircle.layer;
        this.trck = new trackLayer({
            map: this.map
        });
        let group = new hyLayerGroup({
            map: this.map,
            series: [{
                symbolStyle: {
                    'normal': {
                        strokeColor: '#2dbc60',
                        strokeWidth: 3
                    },
                    'emphasis': {
                        strokeColor: 'green',
                        strokeWidth: 4
                    }
                }
            }]

        });
        this.trackLayer = group.layerGroup.getLayers().getArray()[0];
        this.map.addLayer(group.layerGroup);

    }

    initTrackData(polyline) {

        this.trck.initTrackData(polyline);

    }

    /**
     * [clearTrackInfo description]
     * @author WXQ
     * @date   2017-04-20
     * @return {[type]}   [description]
     */
    clearTrackInfo() {

        //清空轨迹线
        this.trackLayer.getSource().clear();
        //清空轨迹tooltip
        this.trackOverlayArray.forEach((overlay) => {

            this.map.removeOverlay(overlay);

        });
        this.trackOverlayArray = [];

    }

    initgpslayer() {

        this.gpslayer = new gpsLayer({
            map: this.map
        });
        // console.log(this.gpslayer);

    }

    updateGps(data) {

        this.gpslayer.update(data);

    }
    createDraw(value) {

        this.queryCircle.createDraw(value);

    }

    /**
     * 销毁对象
     * @return {[type]} [description]
     */
    dispose() {

        this._dom.innerHTML = '';
        this.removeLayers();
        this.removeOverlays();
        this.map.setTarget(null);
        return null;

    }
}

Object.assign(events);