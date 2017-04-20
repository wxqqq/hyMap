import hymapOption from '../model/mapModel';
import hyFeature from './hyFeature';
import baseUtil from '../util/baseUtil';
import colorUtil from '../util/colorUtil';
import events from '../events/events';
import hyLayer from './hyLayer';
import hyGeo from './hyGeo';
import animation from '../animation/animation';
import serieModel from '../model/serieModel';
import hyMapQuery from '../query/hyMapQuery';

const ol = require('ol');

require('../../css/ol.css');
require('../../css/popup.css');

/**
 * 
 */
export default class hyMap extends hyGeo {
    constructor(dom, options) {

        super(options);
        this._geo = hymapOption;

        this.map = null;
        this._show = true;
        this._overlay = null;
        this._event = [];
        this._showLogo = true;
        this._addLayerGroupArray = {};
        this._markerLayer = [];

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

            this.showBaseMap();

        } else {

            this.hideBaseMap();

        }
        this.clearSeries();
        this.setServerUrl(this._geo.serverUrl);
        this.setGeo(this._geo); //设置geo配置
        this.setView(this._geo);
        this.setTooltip(opt_options.tooltip);
        this.addLayer({
            id: new Date().getTime(),
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
        this.setDom(dom);

        this._overlay = this._createOverlay();
        this._createIntercation();
        this._createtrackLayer();

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
            // renderer: 'webgl',
            // target: ,
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                }),
                zoom: false
            }).extend([
                // new ol.control.FullScreen(),
                // new ol.control.MousePosition(),//鼠标位置
                // new ol.control.OverviewMap({
                //     layers: this._basicLayersArray
                // }), //鹰眼
                // new ol.control.ScaleLine()
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
        logoElement.innerHTML = '&copy; 2017 HYDATA';
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
        zoom = 3,
        projection = 'EPSG:3857'
    }) {

        let minZoom = scaleLimit[0];
        let maxZoom = scaleLimit[1];
        //限制缩放
        if (roam === 'false' || roam === false || roam == 'drag') {

            minZoom = zoom;
            maxZoom = zoom;

        }
        //限制平移
        if (roam === 'false' || roam === false || roam == 'scale') {

            this.map.on('pointerdrag', this._panFunction);

        } else {

            this.map.un('pointerdrag', this._panFunction);

        }

        this.view = new ol.View({
            center: this.transform(center, projection),
            zoom: zoom,
            enableRotation: false,
            minZoom: minZoom,
            maxZoom: maxZoom,
            projection: projection
                // extent: []

        });

        this.map.setView(this.view);
        this.map.on('pointermove', function(evt) {

            evt.map.getTargetElement().style.cursor = evt.map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';

        }, this);

        this.view.on('change:resolution', (evt) => {

            if (this.map.getView().getZoom() > 8) {

                this.hideGeo();

            } else {

                this.showGeo();

            }

        });

    }

    _createIntercation() {

        this._createHoverInteraction();
        this._createSelectInteraction();

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

        const id = layer.id || new Date().getTime();
        const layerGroup = this._createLayer(id);
        this.addSeries(layer.series, layerGroup.getLayers());
        return {
            id,
            layerGroup
        };

    }

    updateLayer(options) {

        const id = options.id || null;
        const layerGroup = this._addLayerGroupArray[id]; //获取对应的layergroup

        if (!layerGroup) {

            console.info('未找到对应数据。');
            return;

        }

        const layers = layerGroup.getLayers();
        layers.forEach((layer, index) => {

            const serie = options.series[index]; //新的数据

            const data = serie.data;
            const source = layer.getSource();
            const result = [];

            data.map((value, index) => {

                let feature = source.getFeatureById('serie|' + value.geoCoord);
                if (feature) {

                    feature.setProperties(value);

                } else {

                    result.push(value);

                }

            });
            if (result.length > 0) {

                const featuresObj = hyFeature.getFeatures(result, serie.type);

                //获取feature数组
                const array = featuresObj.features;
                layer.getSource().addFeatures(array);

            }



        });


    }

    removeLayer(id) {


        const group = this._addLayerGroupArray[id];
        if (group) {

            this.map.removeLayer(group);
            delete this._addLayerGroupArray[id];

        }

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

    /**
     * 创建图层数组
     * @param  {[type]} series [description]
     * @return {[type]}        [description]
     */
    addSeries(series, layersArray) {

        series.forEach((serie) => {

            let newserie = baseUtil.clone(serieModel);
            baseUtil.merge(newserie, serie, true);
            this.addSerie(newserie, layersArray);

        });

    }

    /**
     * 增加数据
     * @author WXQ
     * @date   2017-03-22
     * @param  {object}   serie       数据
     * @param  {ol.layer.Group}   layersArray 数据的父容器
     */
    addSerie(serie, layersArray) {

        const data = serie.data;

        if (serie.type == 'chart') {

            this.addMarkers(serie);

        } else {

            //获取feature对象
            const featuresObj = hyFeature.getFeatures(data, serie.type, serie.id);
            //获取feature数组
            const array = featuresObj.features;
            //获取比例缩放的像素最小值，最大值
            const geoScaleNum = this._scaleSize(serie.symbolSize, featuresObj.min, featuresObj.max);
            const textScaleNum = this._scaleSize(serie.labelSize, featuresObj.min, featuresObj.max);
            const source = new ol.source.Vector();
            source.set('labelColumn', serie.labelColumn);
            source.set('data', serie.data);
            source.on('addfeature', (evt) => {

                evt.feature.source = evt.target;
                if (serie.labelAnimate && (serie.labelAnimate.enable == true || serie.labelAnimate.enable === 'true')) {

                    evt.feature.period = serie.labelAnimate.period;
                    evt.feature.on('propertychange', (evt) => {

                        let fea = evt.target;

                        if (evt.key == 'value') {

                            if (!fea.textListenerKey) {

                                fea._intervaldate = new Date().getTime();
                                fea.textListenerKey = this.map.on('postcompose', (evt) => {

                                    this.textScale(evt, fea);

                                });

                            }

                        }


                    });
                }
            });


            source.addFeatures(array);

            let vector = null;
            const style = this._createFeatureStyle(serie);

            if (serie.type == 'heatmap') {

                //创建热力图
                vector = new ol.layer.Heatmap({
                    id: serie.id || '',
                    source: source,
                    type: 'item',
                    gradient: serie.heatOption && serie.heatOption.gradient || undefined,
                    blur: serie.heatOption && serie.heatOption.blur || undefined,
                    radius: serie.heatOption && serie.heatOption.radius || undefined,
                    shadow: serie.heatOption && serie.heatOption.shadow || undefined,
                    showPopup: serie.showPopup,
                    fstyle: style,
                    fScaleNum: geoScaleNum,
                    fSymbol: serie.symbolSize,
                    minResolution: this.getProjectionByZoom(serie.maxZoom),
                    maxResolution: this.getProjectionByZoom(serie.minZoom)
                });

            } else {

                //创建聚合图层
                if (serie.cluster && (serie.cluster.enable == true || serie.cluster.enable === 'true')) {

                    let clusterSource = new ol.source.Cluster({
                        distance: serie.cluster.distance || 20,
                        source: source
                    });
                    clusterSource.on('addfeature', function(evt) {

                        evt.feature.source = evt.target;

                    });
                    vector = new ol.layer.AnimatedCluster({
                        source: clusterSource,
                        style: this._geoStyleFn,
                        type: 'item',
                        showPopup: serie.showPopup,
                        id: serie.id || '',
                        fstyle: style,
                        fScaleNum: geoScaleNum,
                        fSymbol: serie.symbolSize,
                        animationDuration: serie.cluster.animationDuration || 700,
                        minResolution: this.getProjectionByZoom(serie.maxZoom),
                        maxResolution: this.getProjectionByZoom(serie.minZoom)
                    });
                    clusterSource.vector = vector;

                } else {

                    vector = new ol.layer.Vector({
                        id: serie.id || new Date().getTime(),
                        source: source,
                        style: this._geoStyleFn,
                        type: 'item',
                        showPopup: serie.showPopup,
                        fstyle: style,
                        fScaleNum: geoScaleNum,
                        fSymbol: serie.symbolSize,
                        ftextScaleNum: textScaleNum,
                        fText: serie.labelSize,
                        minResolution: this.getProjectionByZoom(serie.maxZoom),
                        maxResolution: this.getProjectionByZoom(serie.minZoom)
                    });

                    this.startAnimate(array, serie.animation); //执行动画

                }

            }

            source.vector = vector;
            layersArray.push(vector);



        }

    }

    addMarkers(serie) {

        const data = serie.data;
        data.forEach(obj => {

            let rootDiv = document.createElement('div');
            rootDiv.id = obj.id;
            rootDiv.appendChild(obj.container);
            document.body.appendChild(rootDiv);
            const marker = new ol.Overlay({
                position: this.transform(obj.geoCoord),
                positioning: 'center-center',
                element: rootDiv,
                stopEvent: false,
                id: serie.id
            });

            this._markerLayer.push(marker);
            this.map.addOverlay(marker);

        });

    }



    /**
     * 执行动画
     * @author WXQ
     * @date   2017-04-13
     * @param  {[type]}   array     [description]
     * @param  {[type]}   options [description]
     * @return {[type]}             [description]
     */
    startAnimate(array, options) {

        if (options && options.enable) {

            const animationThreshold = options.animationThreshold || 1000;
            if (array.length > animationThreshold) {

                return;

            }

            options._intervaldate = new Date().getTime();
            if (options.effectType == 'ripple') {

                this.map.on('postcompose', (evt) => {

                    this.animationRipple(evt, array, options);

                });

            } else {

                this.map.on('postcompose', (evt) => {

                    this.animateFlights(evt, array, options);

                });

            }

        }

    }

    /**
     * [animateFlights description]
     * @author WXQ
     * @date   2017-04-13
     * @param  {[type]}   event     [description]
     * @param  {[type]}   array     [description]
     * @param  {[type]}   options [description]
     * @return {[type]}             [description]
     */
    animateFlights(event, array, options) {

        const duration = options.period * 1000;
        let elapsed = event.frameState.time - options._intervaldate;
        if (elapsed > duration) {

            options._intervaldate = event.frameState.time;
            elapsed = 0;

        }
        let elapsedRatio = elapsed / duration;

        for (let i = 0; i < array.length; i++) {

            this.animateScale(array[i], elapsedRatio);

        }

    }

    animateScale(feature, elapsedRatio) {

        let style = this.getFeatureStyle(feature);
        let image = style[0].getImage();
        image.setScale(ol.easing.upAndDown(elapsedRatio) + 1);
        image.setOpacity(ol.easing.upAndDown(elapsedRatio) + 0.6);
        feature.setStyle(style);

    }

    animateText(feature, elapsedRatio) {

        let old_style = this.getFeatureStyle(feature);
        let style = [old_style[0].clone(), old_style[1].clone()];
        let text = style[1].getText();
        text.setScale(ol.easing.upAndDown(elapsedRatio) + 1);
        feature.setStyle(style);

    }

    textScale(event, feature) {

        const duration = feature.period * 1000 || 700;
        let time = event.frameState ? event.frameState.time : new Date().getTime();
        let elapsed = time - feature._intervaldate;

        if (elapsed > duration) {

            feature.setStyle();
            this.map.un('postcompose', feature.textListenerKey.listener);
            feature.textListenerKey = undefined;
            return;

        } else {

            let elapsedRatio = elapsed / duration;
            this.animateText(feature, elapsedRatio);

        }


    }

    /**
     * 涟漪动画
     * @param  {[type]} event [description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    animationRipple(event, array, options) {

        const duration = options.period * 1000;
        let vectorContext = event.vectorContext;
        let elapsed = event.frameState.time - options._intervaldate;
        //当时间超过周期2倍时，修改start为当前-周期。保证循环播放能够顺序进行。
        if (elapsed > duration * 2) {

            options._intervaldate = new Date().getTime() - duration;
            elapsed = event.frameState.time - options._intervaldate;

        }
        //获取涟漪生产的间隔。
        const step = Math.ceil((elapsed / duration * 3));
        let elapsedRatio = elapsed / duration;


        for (let i = 0; i < array.length; i++) {

            let feature = array[i];
            let style = this.getFeatureStyle(feature);

            const styleObj = style[0]; //0位置为图标。1为文本
            const icon = styleObj.getImage();
            const radius = (icon instanceof ol.style.Icon) ? icon.getImageSize()[0] / 2 : icon.getRadius();
            const color = (icon instanceof ol.style.Icon) ? undefined : icon.getFill().getColor();
            const flashGeom1 = feature.clone();
            const style1 = this._createAnimationStyle(elapsedRatio, radius, options.scale, options.brushType, color);
            vectorContext.drawFeature(flashGeom1, style1);
            //根据间隔进行多个圈的绘制。模拟多次扩展效果
            for (let n = 0; n < step; n++) {

                let flashGeom = feature.clone();
                const elapsed1 = elapsed - n * duration / 3;
                const elapseRatio1 = elapsed1 / duration;
                if (elapsed1 > 0) {

                    const style = this._createAnimationStyle(elapseRatio1, radius, options.scale, options.brushType, color);
                    vectorContext.drawFeature(flashGeom, style);

                }

            }

        }

        this.map.render();

    }



    /**
     * 涟漪动画样式设置
     * @param  {[type]} elapsedRatio [description]
     * @param  {[type]} iconradius   [description]
     * @param  {Number} scale        [description]
     * @param  {String} type         [description]
     * @return {[type]}              [description]
     */
    _createAnimationStyle(elapsedRatio, iconradius, scale = 2.5, type = 'stroke', color = 'rgba(140,0,140,1)') {

        let opacity = ol.easing.easeOut(1 - elapsedRatio) - 0.2;
        const radius = ol.easing.easeOut(elapsedRatio) * (scale - 1) * iconradius + iconradius;
        let image;
        if (color.indexOf('rgb') > -1) {

            if (color.indexOf('rgba') > -1) {

                color = colorUtil.rgbaToRgb(color);

            }
            color = colorUtil.colorHex(color);

        }

        const colorRgba = colorUtil.hexToRgba(color, opacity);

        if (type == 'stroke') {

            image = new ol.style.Circle({
                radius: radius,
                snapToPixel: false,
                stroke: new ol.style.Stroke({
                    color: colorRgba,
                    width: 0.25 + opacity
                })
            });

        } else {

            image = new ol.style.Circle({
                radius: radius,
                snapToPixel: false,
                fill: new ol.style.Fill({
                    color: colorRgba

                })
            });

        }
        return new ol.style.Style({
            image: image
        });

    }

    /**
     * [_removeSerie description]
     * @author WXQ
     * @date   2017-03-22
     * @param  {[type]}   id [description]
     * @return {[type]}      [description]
     */
    _removeSerie(id) {

        this._markerLayer.forEach(obj => {

            const key = obj.get('id');
            if (key == id) {

                this.map.removeOverlay(obj);
                return;

            }

        });

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

            this.clearSeries();

        }


    }


    clearSeries() {

        for (let group in this._addLayerGroupArray) {

            this.map.removeLayer(group);

        }

        this._addLayerGroupArray = {};
        this._removeMarkerOverlay();

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



    getFeaturesByProperty(key, value) {

        const layersGroup = this.map.getLayers();
        let array = [];
        layersGroup.forEach((group) => {

            const layers = group.getLayers();
            layers.forEach((element) => {

                if (element.getSource() instanceof ol.source.Vector) {

                    const features = element.getSource().getFeatures && element.getSource().getFeatures();

                    features && features.forEach((feature) => {

                        if (feature.get(key) && feature.get(key) == value) {

                            const pixel = this.getPixelFromCoords(feature.getGeometry().getCoordinates());
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
    flyto(geoCoord, {
        animateDuration = 2000,
        zoom = 5,
        animateEasing = '',
        callback = undefined
    } = {}) {

        if (geoCoord instanceof ol.geom.Geometry) {

            this.view.fit(geoCoord.getExtent(), {
                duration: animateDuration

            });

        } else {

            let geometry = new ol.geom.Point(this.transform(geoCoord, this.map.getView().getProjection()));
            let animate = new animation(this.map, geometry, zoom, animateDuration);
            zoom === 5 ? animate.centerAndZoom() : animate.flyTo();

        }
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

    /**
     * [areaQuery description]
     * @author WXQ
     * @date   2017-04-12
     * @param  {[type]}   options {geom,layers}
     * @return {[type]}           [description]
     */
    areaQuery(options) {

        const geom = options.geom;

        let result = {};
        const layers = options.layers;

        for (let key in layers) {

            const group = layers[key];


            const childLayers = group.getLayers();
            let array = [];
            result[group.get('id')] = array;
            childLayers.forEach((layer) => {


                layer.getSource().forEachFeature((feature) => {

                    const coord = feature.getGeometry().getCoordinates();
                    if (geom.intersectsCoordinate(coord)) {

                        array.push(feature);
                        this.clickSelect.getFeatures().push(feature);

                    }

                });


            });

        }

        return result;

    }
    spatialQuery(geoCoord, radius) {

        this.clearTrackInfo();
        const coords = this.transform(geoCoord);
        const geometry = new ol.geom.Circle(coords, radius);

        const geom_temp = [coords[0] + radius, coords[1]];
        const piex_center = this.map.getPixelFromCoordinate(coords);

        const piex_radius = this.map.getPixelFromCoordinate(geom_temp)[0] - piex_center[0];
        const data = this.areaQuery({
            geom: geometry,
            layers: this._addLayerGroupArray
        });

        let result = {
            geometry,
            center: coords,
            piex_center,
            piex_radius,
            data
        };


        return result;

    }

    drawTrack(start, end, {
        callback = undefined,
        tooltipFun = undefined
    } = {}) {

        //起始点一致，不进行查询
        if (start.toString() == end.toString()) {

            return;

        }

        let url = 'http://localhost:3000/routing';
        const viewparams = ['x1:' + start[0], 'y1:' + start[1], 'x2:' + end[0], 'y2:' + end[1]];
        url = 'http://192.168.0.50:8080/geoserver/hygis/wfs?sversion=1.0.0&request=GetFeature&outputFormat=application%2Fjson';
        url += '&typeName=' + 'routing_sd' + '&viewparams=' + viewparams.join(';');

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

                let str = baseUtil.isFunction(tooltipFun) ? tooltipFun({
                    length,
                    time
                }) : tooltipFun;

                if (str) {

                    this._createTrackOverLay(start, str);

                }


            }

        }).catch(function(e) {

            console.log(e);

        });

    }

    _createTrackOverLay(coordinate, str = '') {


        let overlay = this._createOverlay();
        let div = overlay.getElement();
        div.innerHTML = str;
        overlay.setPosition(this.transform(coordinate));
        this.trackOverlayArray.push(overlay);

    }

    _createtrackLayer() {

        let group = this.addLayer({
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

    }

    /**
     * 根据坐标获取经纬度
     * @author WXQ
     * @date   2017-03-24
     * @param  {[type]}   coords [description]
     * @return {[type]}          [description]
     */
    getPixelFromCoords(coords) {

        if (!coords) {

            return;

        }
        const newcoords = this.transform(coords);
        return this.map.getPixelFromCoordinate(newcoords);

    }

    /**
     * [getProjectionByZoom description]
     * @author WXQ
     * @date   2017-04-18
     * @param  {[type]}   zoom [description]
     * @return {[type]}        [description]
     */
    getProjectionByZoom(zoom) {

        if (zoom) {

            return this.view.constrainResolution(
                this.view.getMaxResolution(), zoom - this.view.minZoom_, 0);

        }

    }

    /**
     * [transform description]
     * @author WXQ
     * @date   2017-04-18
     * @param  {[type]}   coords     [description]
     * @param  {[type]}   projection [description]
     * @return {[type]}              [description]
     */
    transform(coords, projection) {

        return ol.proj.fromLonLat([Number(coords[0]), Number(coords[1])], projection);

    }
}

Object.assign(hyMap.prototype, events);
Object.assign(hyMap.prototype, hyLayer);