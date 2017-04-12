import hymapOption from '../options/hymapOption';
import baseUtil from '../util/baseUtil';
import colorUtil from '../util/colorUtil';
import events from '../events/events';
import hylayers from './hylayers';
import animation from '../animation/animation';
import serieModel from '../model/serieModel';
import hyMapQuery from '../query/hyMapQuery';

const ol = require('../../public/lib/ol');

require('../../css/ol.css');
require('../../css/popup.css');

/**
 * 
 */
export default class hyMap extends hylayers {
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

            data.forEach(obj => {

                let rootDiv = document.createElement('div');
                rootDiv.id = obj.id;
                rootDiv.appendChild(obj.container);
                document.body.appendChild(rootDiv);
                const marker = new ol.Overlay({
                    position: this.transform([Number(obj.geoCoord[0]), Number(obj.geoCoord[1])]),
                    positioning: 'center-center',
                    element: rootDiv,
                    stopEvent: false,
                    id: serie.id
                });

                this._markerLayer.push(marker);
                this.map.addOverlay(marker);

            });

        } else {

            const featuresObj = this.getFeatures(data, serie.type);
            const array = featuresObj.features;
            const geoScaleNum = this._geoSymbolScale(serie.symbolSize, featuresObj.min, featuresObj.max);
            const source = new ol.source.Vector();
            source.on('addfeature', function(evt) {

                evt.feature.source = evt.target;

            });
            source.addFeatures(array);
            let vector = null;
            const style = this._createFeatureStyle(serie);

            if (serie.type == 'heatmap') {

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

                    this.openAnimate(array, serie.animation); //涟漪动画

                    vector = new ol.layer.Vector({
                        id: serie.id || new Date().getTime(),
                        source: source,
                        style: this._geoStyleFn,
                        type: 'item',
                        showPopup: serie.showPopup,
                        fstyle: style,
                        fScaleNum: geoScaleNum,
                        fSymbol: serie.symbolSize,
                        minResolution: this.getProjectionByZoom(serie.maxZoom),
                        maxResolution: this.getProjectionByZoom(serie.minZoom)
                    });

                }

            }

            source.vector = vector;
            layersArray.push(vector);

        }

    }

    getFeatures(data, type) {

        let features = [];
        let valueArray = [];
        data.forEach((obj) => {

            let feature = new ol.Feature({
                geometry: this._createGeometry(type, obj.geoCoord),
                dataIndex: new Date().getTime()

            });
            feature.setProperties(obj);
            feature.setId(obj.id);
            // const featurestyle = this._createGeoStyle(serie.itemStyle, serie.label);
            // feature.set('style', featurestyle);
            features.push(feature);
            valueArray.push(obj.value);


        });
        const max = Math.max(...valueArray);
        const min = Math.min(...valueArray);
        return {
            features,
            max,
            min
        };

    }
    openAnimate(array, animation) {

        if (animation && animation.enable) {

            if (array.length > animationThreshold) {

                return;

            }
            const animationThreshold = animation.animationThreshold ? animation.animationThreshold : 1000;

            animation._intervaldate = new Date().getTime();
            if (animation.effectType == 'ripple') {

                this.map.on('postcompose', (evt) => {

                    this.animationRipple(evt, array, animation);

                });

            } else {

                this.map.on('postcompose', (evt) => {

                    this.animateFlights(evt, array, animation);

                });

            }

        }

    }
    animateFlights(event, array, animation) {

        const duration = animation.period * 1000;
        let elapsed = event.frameState.time - animation._intervaldate;
        if (elapsed > duration) {

            animation._intervaldate = new Date().getTime();
            elapsed = event.frameState.time - animation._intervaldate;

        }
        let elapsedRatio = elapsed / duration;

        for (let i = 0; i < array.length; i++) {

            let feature = array[i];
            let style = feature.getStyle();
            if (!style) {

                style = typeof feature.source.vector.getStyle() === 'function' ? feature.source.vector.getStyle()(feature) : feature.source.vector.getStyle();

                feature.setStyle(style);

            }

            const image = style[0].getImage();
            image.setScale(ol.easing.upAndDown(elapsedRatio) + 1);
            image.setOpacity(ol.easing.upAndDown(elapsedRatio) + 0.6);
            feature.set('scale', elapsedRatio);



        }
        this.map.render();

    }

    /**
     * 涟漪动画
     * @param  {[type]} event [description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    animationRipple(event, array, animation) {

        const duration = animation.period * 1000;
        let vectorContext = event.vectorContext;
        let elapsed = event.frameState.time - animation._intervaldate;
        //当时间超过周期2倍时，修改start为当前-周期。保证循环播放能够顺序进行。
        if (elapsed > duration * 2) {

            animation._intervaldate = new Date().getTime() - duration;
            elapsed = event.frameState.time - animation._intervaldate;

        }
        //获取涟漪生产的间隔。
        const step = Math.ceil((elapsed / duration * 3));
        let elapsedRatio = elapsed / duration;


        for (let i = 0; i < array.length; i++) {

            let feature = array[i];
            let style = feature.getStyle();
            if (!style) {

                style = typeof feature.source.vector.getStyle() === 'function' ? feature.source.vector.getStyle()(feature) : feature.source.vector.getStyle();


            }

            const styleObj = style[0]; //0位置为图标。1为文本
            const icon = styleObj.getImage();
            const radius = (icon instanceof ol.style.Icon) ? icon.getImageSize()[0] / 2 : icon.getRadius();
            const color = (icon instanceof ol.style.Icon) ? undefined : icon.getFill().getColor();
            const flashGeom1 = feature.clone();
            const style1 = this._createAnimationStyle(elapsedRatio, radius, animation.scale, animation.brushType, color);
            vectorContext.drawFeature(flashGeom1, style1);
            //根据间隔进行多个圈的绘制。模拟多次扩展效果
            for (let n = 0; n < step; n++) {

                let flashGeom = feature.clone();
                const elapsed1 = elapsed - n * duration / 3;
                const elapseRatio1 = elapsed1 / duration;
                if (elapsed1 > 0) {

                    const style = this._createAnimationStyle(elapseRatio1, radius, animation.scale, animation.brushType, color);
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
     * 创建空间对象
     * @param  {[type]} type [description]
     * @param  {[type]} obj  [description]
     * @return {[type]}      [description]
     */
    _createGeometry(type, geoCoord) {

        let geometry = null;
        let coords = [];
        if (baseUtil.isString(geoCoord)) {

            geoCoord = this.deleteEndSign(geoCoord, ';');
            const str = geoCoord.split(';');
            str.forEach((obj) => {

                const coord = obj.split(',');
                const coordinate = this.transform([Number(coord[0]), Number(coord[1])]);
                coords.push(coordinate);

            });

        } else {

            coords = geoCoord;

        }

        if (type == 'line') {

            geometry = new ol.geom.LineString(coords);

        } else
        if (type == 'polygon') {

            geometry = new ol.geom.Polygon(coords);

        } else {

            if (coords.length == 1) {

                coords = coords[0];

            } else {

                coords = this.transform([Number(coords[0]), Number(coords[1])]);

            }
            geometry = new ol.geom.Point(coords);

        }

        return geometry;

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

            const layers = group.getLayers();
            layers.forEach(function(element) {

                feature = element.getSource().getFeatureById && element.getSource().getFeatureById(id);

            });

        });
        return feature;


    }

    getFeaturesByProperty(key, value) {

        const layersGroup = this.map.getLayers();
        let array = [];
        layersGroup.forEach((group) => {

            const layers = group.getLayers();
            layers.forEach((element) => {

                const features = element.getSource().getFeatures && element.getSource().getFeatures();

                features && features.forEach((feature) => {

                    if (feature.get(key) && feature.get(key) == value) {

                        const pixel = this.getPixelFromCoords(feature.getGeometry().getCoordinates());
                        array.push({
                            pixel: pixel,
                            properties: feature.getProperties()
                        });

                    }

                });

            });

        });
        return array;

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
        const newcoords = ol.proj.fromLonLat(coords);
        return this.map.getPixelFromCoordinate(newcoords);

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

        let geometry = new ol.geom.Point(ol.proj.fromLonLat(geoCoord, this.map.getView().getProjection()));
        let animate = new animation(this.map, geometry, zoom, animateDuration);
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

    getFeaturesByCircle(geoCoord, radius) {

        const geom = new ol.geom.Circle(this.transform([Number(geoCoord[0]), Number(geoCoord[1])]),
            radius);
        return hyMapQuery.areaQuery({
            geom: geom,
            layers: this._addLayerGroupArray
        });

    }


    getProjectionByZoom(zoom) {

        if (zoom) {

            return this.view.constrainResolution(
                this.view.getMaxResolution(), zoom - this.view.minZoom_, 0);

        }

    }

    transform(coords, projection) {

        return ol.proj.fromLonLat(coords, projection);

    }
}

Object.assign(hyMap.prototype, events);