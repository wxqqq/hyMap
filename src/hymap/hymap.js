import hymapOption from '../model/mapModel';
import hyLayerGroup from '../components/hyLayerGroup';
import baseUtil from '../util/baseUtil';
import mapTool from '../util/mapToolUtil';
import events from '../events/events';
import hymap from '../components/map';
import hyView from '../components/view';
import hyMeasure from '../components/tools/hyMeasure';
import hytooltip from '../components/tooltip/hytooltip';
import animation from '../animation/animation';
import * as Layer from '../components/layer';

const ol = require('ol');

export default class hyMap extends hytooltip {
    /**
     * 初始化
     * @param  {Document}   dom     dom对象
     * @param  {Object}   options   参数
     * @extends events
     */
    constructor(dom, options) {

        super(options);
        /**
         * basiclayersarray
         * @private
         * @type {ol.Collection}
         */
        this.baseLayer;
        this._geo = hymapOption;
        /**
         * map实例
         * @type {[type]}
         */
        this.map = null;
        /**
         * 是否显示
         * @type {Boolean}
         */
        this._show = true;
        this.tooltipOverLay = null;
        this._event = [];
        /**
         * 是否显示logo
         * @private
         * @type {Boolean}
         */
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
        this.postListenerObj = {};

    }

    /**
     * 初始化hymap对象
     * @param  {Element} dom 
     */
    init(dom) {

        this.setDom(dom);
        return this;

    }

    /**
     * 设置地图参数
     * @param {Object} options 参数
     * @example
     *   
     *  mapObj = map.init(document.getElementById('map'))
        let options = {
            serverUrl: 'http://192.168.1.50:8080/geoserver',
            show: true, //地图的显示状态 true为显示 false 为不显示
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            // theme: {
            // type: 'tile',
            // url: 'http://mape.shanghai-map.net/ArcGIS/rest/services/SHMAP_DZJ/MapServer'
            // url: 'http://192.168.4.35:6080/arcgis/rest/services/MZL/MapServer'
            // url: 'http://localhost:8080/all'
            // }, //地图风格
            // center: [117.52359952545166, 49.52355306224895], //当前视角中心: [经度, 纬度]
            zoom: 3, //当前地图缩放比例
            scaleLimit: [2, 18], //滚轮缩放的边界
            // string('dark'，'blue'，'white')|mapObjectr{mapId,key} 对应maobox中的mapid和access_token

            theme: {
                type: 'mapbox',
                mapId: 'zhangyujie.a80cdc83',
                key: 'sk.eyJ1Ijoiemhhbmd5dWppZSIsImEiOiJkTEp6WDZrIn0.nY5bsQlZegBbb2uGgJ5jEA'
                    // type: 'arcgis',
                    // type: 'satellite',
                    // url: 'http://192.168.1.201/MapTileDownload/googlemaps/satellite'
                    // url: 'http://192.168.4.35:8080/QingHai/'
                    // url: 'http://192.168.4.35:6080/arcgis/rest/services/TianJin/MapServer'
                    // url: 'http://192.168.4.35:6080/a/arcgisserver/directories/arcgiscache/TianJin/%E5%9B%BE%E5%B1%82/_alllayers'
            }, //地图风格
        };
     */
    setOption(options) {

        if (!options) {

            return;

        }

        baseUtil.merge(this._geo, options || {}, true);
        this.setServerUrl(this._geo.serverUrl);
        // this.setGeo(this._geo); //设置geo配置
        //
        this.setTheme(this._geo.theme); //设置theme主题
        this.setView(this._geo);
        this.setTooltip(options.tooltip);
        this.addLayer(this._geo.series); //设置series

    }

    /**
     * 获取option对象
     * @return {Object} [description]
     */
    getOption() {

        return this._geo;

    }

    /**
     * 设置map对应的容器
     * @param {Element} dom [description]
     */
    setDom(dom) {

        if (dom) {

            this._dom = dom;
            // dom.tabIndex = 0;
            this.map.setTarget(dom);

        }

    }

    /**
     * 获取map对应的dom容器
     * @return {Element} [description]
     */
    getDom() {

        return this._dom;

    }

    /**
     * 内部初始化
     * @private
     * @param  {Element} dom [description]
     */
    _init(dom) {

        this.map = new hymap(dom);
        mapTool.map = this.map;

        this._dom = dom;
        this._createBasicLayer();

        this.tooltipOverLay = this.createOverlay();
        this._createIntercation();
        this._createCircleQuery();
        this._createtrackLayer();
        // this.hymeasure = new hyMeasure({
        // map: this.map
        // });

    }

    /**
     * 创建基础图层组
     * @private
     */
    _createBasicLayer() {

        //底图
        this.baseLayer = new Layer.baseMap({
            map: this.map
        });

    }

    /**
     * 显示底图
     */
    showBaseMap() {

        this.baseLayer.show();

    }

    /**
     * 隐藏底图
     */
    hideBaseMap() {

        this.baseLayer.hide();

    }

    /**
     * 设置底图风格
     * @param {String|Object|Array} theme 'dark','blue','white' 默认为blue
     * @example
     *
     * setTheme('dark');
     * setTheme({type:'tile',url:'http://ip:port'})
     * setTheme({type:'arcgis',url:'http://ip:port'})
     * setTheme({type:'mapbox',mapId:'sdfsfdsfdsfdsf',key:'sssdfsdfdsfds'})
     * setTheme(['dark',{type:'tile',url:'http://ip:port'}...])
     */
    setTheme(theme) {

        this.baseLayer.setUrl(this._serverUrl);
        this.baseLayer.setTheme(theme);

    }

    /**
     * 设置请求服务器地址
     * @param {String} url 服务器地址ip
     */
    setServerUrl(url) {

        this._serverUrl = url;

    }

    /**
     * 获取服务器地址
     */
    getServerUrl() {

        return this._serverUrl;

    }

    /**
     * 创建view
     * @private 
     */
    setView(geo) {

        this.view = new hyView(geo, this.map);
        this.map.setView(this.view);

    }


    /**
     * 设置中心点
     * @param {Array} coord 坐标数组
     */
    setCenter(coord) {

        this.view.setCenter(mapTool.transform(coord));

    }
    _createIntercation() {

        this._createHoverInteraction();
        this._createSelectInteraction();

    }

    /**
     * 启动测量
     * @private
     * @param  {String} type 类型 distance,area 
     */
    measure(type) {

        this.hymeasure.active(type);

    }

    /**
     * 增加图层
     * @param {Array} arrays 参数
     * @example
     *     const series1 = [{
                id: 3,
                cluster: {
                    enable: false, //是否开启聚合
                    distance: 50, // number 聚合点之间的距离 默认为20个单位（piex）
                    animationDuration: 700 //聚合动画时间，默认为700毫秒
                },
                // maxZoom: 10, //数据显示最大级别
                // minZoom: 6, //数据显示最小级别
                data: values,
                type: 'point',
                visible: true,
                // opacity: 0.2,
                symbol: 'icon:test/data/jingli-1.png',
                // symbol: 'circle',
                symbolSize: [15, 20],
                symbolStyle: {
                    normal: {
                        anchor: [0.5, 0.5], //图标偏移位置。
                        // color: 'red'
                        // symbolSize: [15, 15],
                        fillColor: 'red', // 'rgb(140,0,140)',
                        strokeWitdh: 1,
                        strokeColor: 'rbg(140,0,140)'
                    },
                    emphasis: {
                        strokeWitdh: 2,
                        fillColor: 'red',

                        symbolSize: [17, 22]
                    }
                },
                labelColumn: 'name',
                labelSize: [10, 20],
                label: {
                    normal: {
                        show: false,
                        textStyle: {
                            color: '#fff',
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontFamily: 'sans-serif',
                            fontSize: '55px',
                            offsetY: 10,
                            offsetX: -15
                        }
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '16px'
                        }
                    }
                },
                showPopup: false //显示气泡框
            }];

            let layer1 = mapObj.addLayer({
                id: 5,
                visible: true,
                opacity: 1,
                series: series1
            });

            layer1.on('click', function (data) {
                console.log('layer1', data);
            });
            // console.log(layer1);
            mapObj.un('click');
     */
    addLayer(arrays) {

        let layers = [];
        if (Array.isArray(arrays)) {

            arrays.forEach(serie => {

                let layer = this._addLayer(serie);
                layers.push(layer);

            });

        } else {

            arrays.map = this.map;
            layers = new hyLayerGroup(arrays);
            this._addLayerGroupArray[layers.id] = layers;

        }

        return layers;

    }

    _addLayer(serie) {

        let layer;
        serie.id = serie.id || 'layer_' + new Date().getTime();
        switch (serie.type) {
            case 'track':
                layer = this.initTrackData(serie);
                break;
            case 'gps':
                layer = this.initgpslayer(serie);
                break;
            case 'region':
                serie.url = serie.url || this._serverUrl;
                serie = new Layer.regionLayer({
                    map: this.map,
                    serie
                });
                break;
            default:
                layer = new Layer.hyLayer({
                    map: this.map,
                    serie: serie
                });
                this.map.addLayer(layer.getLayer());
        }

        this._addLayerGroupArray[serie.id] = layer;
        return layer;

    }

    /**
     * 更新图层数据
     * @param  {Object} arrays serie对象
     */
    updateLayer(arrays) {

        this.clearSelect();

        if (Array.isArray(arrays)) {

            arrays.forEach(serie => {

                const layer = this._addLayerGroupArray[serie.id]; //获取对应的layergroup
                if (!layer) {

                    this._addLayer(serie);

                } else {

                    layer.update(serie);

                }

            });

        } else {

            const id = arrays.id || null;
            const layer = this._addLayerGroupArray[id]; //获取对应的layergroup
            if (!layer) {

                console.info('未找到对应数据。', id);
                return;

            }
            layer.update(arrays);

        }

    }

    /**
     * 图层是否存在
     * @param  {String}  id 唯一标识
     * @return {Boolean}    
     */
    hasLayer(id) {

        const layer = this._addLayerGroupArray[id];
        if (layer) {

            return true;

        }
        return false;

    }

    /**
     * 获取图层
     * @param  {String|undefined} id 唯一标识
     * @return {Object}    layer对象
     */
    getSeries(id) {

        let obj = [];
        if (id) {

            obj.push(this.getSerie(id));

        } else {

            for (let id in this._addLayerGroupArray) {

                obj.push(this.getSerie(id));

            }

        }

        return obj;

    }

    /**
     * 获取图层信息
     * @param  {String} id 唯一标识
     * @return {Object}    数据对象
     */
    getSerie(id) {

        let serie = [];
        let layer = this._addLayerGroupArray[id];

        if (layer instanceof hyLayerGroup) {

            let series = [];
            layer.layersArray.forEach((layer) => {

                series.push(layer.get('serie'));

            });

            serie = {
                id: id,
                series
            };

        } else {

            serie = layer.layer.get('serie');

        }
        return serie;

    }

    /**
     * 显示图层
     * @param  {String} id 唯一标识
     */
    showLayer(id) {

        const layer = this._addLayerGroupArray[id];
        layer && layer.show(true);

    }

    /**
     * 隐藏图层
     * @param  {String} id 唯一标识
     */
    hideLayer(id) {

        const layer = this._addLayerGroupArray[id];
        layer && layer.hide(false);

    }

    /**
     * 移除layer
     * @param  {String} id 唯一标识
     * @return {Boolean}    成功，失败
     */
    removeLayer(id) {

        const layer = this._addLayerGroupArray[id];
        if (layer) {

            layer.dispose();
            delete this._addLayerGroupArray[id];
            return true;

        }
        return false;

    }

    /**
     * 移除所有图层
     */
    removeLayers() {

        for (let group in this._addLayerGroupArray) {

            this.removeLayer(group);

        }

        this._addLayerGroupArray = {};

    }

    /**
     * 批量叠加标记
     * @param {Object} data 数据
     */
    addMarkers(data) {

        data.forEach(obj => {

            this.addOverlay(obj);

        });

    }

    /**
     * 增加覆盖物
     * @param {String}  options.id            id 唯一标识
     * @param {Array}  options.geoCoord      坐标
     * @param {Element}  options.container     内容
     * @param {Boolean} options.showLine      显示连线
     * @param {String}  options.lineColor     线颜色
     * @param {Number}  options.lineWidth     线的偏移长度
     * @param {String}  options.lineDirection right,left 方向
     * @param {Array}   options.offSet        [0,0] 偏移量
     * @param {String}  options.positioning   top-left' top[center,bottom]-left[right];相对位置
     */
    addOverlay({
        id = '',
        geoCoord = undefined,
        container = document.createElement('div'),
        showLine = false,
        lineColor = 'white',
        lineWidth = 80,
        lineDirection = 'right',
        offSet = [0, 0],
        positioning = 'center-center'
    } = {}) {

        let marker = this._markerLayer[id];

        if (marker) {

            this.map.removeOverlay(marker);

        }

        container.addEventListener('click', e => {

            if (this.topOverlay) {

                this.topOverlay.style.zIndex = '';

            }
            this.topOverlay = marker.getElement().parentNode;
            this.topOverlay.style.zIndex = 999;
            this.dispatchEvent({
                evt: e,
                type: 'tooltipClick',
                // feature: unSelFeatures
                select: e.target
            });

        });

        marker = new ol.Overlay({
            id: id,
            position: mapTool.transform(geoCoord),
            positioning: positioning,
            offset: offSet,
            element: container,
            stopEvent: false

        });
        marker.set('geoCoord', geoCoord);
        this._markerLayer[id] = marker;
        this.map.addOverlay(marker);

        if (showLine) {

            container.style.position = 'static';
            container.style.float = 'left';
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = lineWidth;
            canvas.height = container.offsetHeight;
            ctx.strokeStyle = lineColor ? lineColor : 'white';
            if (lineDirection && lineDirection === 'left') {

                container.style.float = 'right';
                ctx.translate(lineWidth, 0);
                ctx.scale(-1, 1);

            }
            ctx.moveTo(lineWidth, canvas.height);
            let tmpX = lineWidth / 2;
            ctx.lineTo(tmpX, 6);
            ctx.lineTo(0, 6);
            ctx.stroke();
            container.parentNode.appendChild(canvas);

        }
        return marker;

    }

    /**
     * 显示覆盖物
     * @param  {String} id [description]
     */
    showOverlay(id) {

        const marker = this._markerLayer[id];
        marker && marker.setPosition(mapTool.transform(marker.get('geoCoord')));

    }

    /**
     * 隐藏覆盖物
     * @param  {String} id [description]
     */
    hideOverlay(id) {

        const marker = this._markerLayer[id];
        marker && marker.setPosition();

    }

    /**
     * 删除覆盖物
     * @param  {overlay|id} marker 覆盖物
     */
    removeOverlay(marker) {

        if (!(marker instanceof ol.Overlay)) {

            marker = this._markerLayer[marker];

        }

        if (marker) {

            this.dispatchEvent({
                type: 'removeOverlay',
                select: marker
            });
            this.map.removeOverlay(marker);
            delete this._markerLayer[marker.getId()];

        }

    }

    /**
     * 删除所有覆盖物
     */
    removeOverlays() {

        for (let id in this._markerLayer) {

            const marker = this._markerLayer[id];
            this.map.removeOverlay(marker);

        }

    }

    /**
     * 移除数据
     * @param   {String} id 唯一标识
     * @private
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

    /**
     * 获取当前地图信息
     * @return {Object}
     */
    getMapOption() {

        let option = baseUtil.clone(this._geo);
        option.zoom = this.map.getView().getZoom();
        option.center = this.map.getView().getCenter();
        return option;

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

    /**
     * 根据id获取feature
     * @param  {String} id 唯一标识
     * @return {object|null} feature feature    
     * 
     */
    getFeatureById(id) {

        //todo 没有进行聚合判断
        const layersGroup = this.map.getLayers();
        let features = [];
        layersGroup.forEach(group => {

            if (group instanceof ol.layer.Group) {

                const layers = group.getLayers();
                layers.forEach(function(element) {

                    if (element.getSource() instanceof ol.source.Vector) {

                        const feature = element.getSource().getFeatureById(id);
                        feature && features.push(feature);

                    }

                });

            } else {

                if (group.getSource() instanceof ol.source.Vector) {

                    const feature = group.getSource().getFeatureById(id);
                    feature && features.push(feature);

                }

            }

        });
        return features;

    }

    /**
     * 根据属性获取features
     * @param  {String}   key   属性 
     * @param  {String}   value 值
     * @return {Array}    features  features数组
     */
    getFeaturesByProperty(key, value) {

        const layersGroup = this.map.getLayers();
        let array = [];
        layersGroup.forEach(group => {

            if (group instanceof ol.layer.Group) {

                const layers = group.getLayers();
                layers.forEach(element => {

                    if (element.getSource() instanceof ol.source.Vector) {

                        const features = element.getSource().getFeatures();

                        features && features.forEach(feature => {

                            if (feature.get(key) && feature.get(key) === value) {

                                const pixel = mapTool.getPixelFromCoords(
                                    feature.getGeometry().getCoordinates()
                                );
                                array.push({
                                    pixel: pixel,
                                    // properties: feature.getProperties()
                                    properties: feature
                                });

                            }

                        });

                    }

                });

            } else {

                if (group.getSource() instanceof ol.source.Vector) {

                    const features = group.getSource().getFeatures();

                    features && features.forEach(feature => {

                        if (feature.get(key) && feature.get(key) == value) {

                            const pixel = mapTool.getPixelFromCoords(
                                feature.getGeometry().getCoordinates()
                            );
                            array.push({
                                pixel: pixel,
                                // properties: feature.getProperties()
                                properties: feature
                            });

                        }

                    });

                }

            }

        });
        return array;

    }

    /**
     * 切换地图显示隐藏状态
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
     */
    hide() {

        this._dom.style.display = 'none';
        this._show = false;

    }

    /**
     * 显示dom对象
     */
    show() {

        this._dom.style.display = 'block';
        this._show = true;

    }

    /**
     * 地图更新尺寸，改变地图所在div尺寸时调用地图重绘
     * 
     */
    resize() {

        this.map.updateSize();

    }

    /**
     * 地图移动方法
     * @param  {Array} geoCoord                坐标数组
     * @param  {Number} options.animateDuration 动画执行时长
     * @param  {Number} options.zoom            地图级别
     * @param  {String} options.animateEasing   默认为线性
     * @param  {Function} options.callback        回调方法
     */
    flyTo(
        geoCoord, {
            animateDuration = 2000,
            zoom = undefined,
            animateEasing = '',
            callback = undefined
        } = {}
    ) {

        let geometry = geoCoord;
        if (!(geometry instanceof ol.geom.Geometry)) {

            geometry = new ol.geom.Point(
                mapTool.transform(geoCoord, this.map.getView().getProjection())
            );

        }
        if (zoom) {

            let animate = new animation(
                this.map,
                geometry,
                zoom,
                animateDuration,
                animateEasing
            );
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

    zoomToSeries({
        duration = 2000,
        nearest = false
    } = {}) {

        let extent = ol.extent.createEmpty();

        for (const id in this._addLayerGroupArray) {

            let layerExtent = this._addLayerGroupArray[id].getExtent();
            !ol.extent.isEmpty(layerExtent) && ol.extent.extend(extent, layerExtent);

        }


        this.view.fit(extent, {
            duration: duration,
            nearest: nearest
        });

    }

    /**
     * 缩放到指定级别
     * @param  {Number}  num      级别
     * @param  {Boolean} relative 是否相对级别
     */
    zoomTo(num = 1, relative = false) {

        let zoom = this.view.getZoom();

        if (relative) {

            zoom += num;

        } else {

            zoom = num;
            let minZoom = this.view.getMinZoom();

            if (num < minZoom) {

                zoom = minZoom;

            }

        }

        this.view.animate({
            zoom: zoom
        });

    }

    /**
     * 平移
     * @param  {String}  up,down,left,right上下左右
     * @param  {Number} meter    距离 单位 米
     */
    panTo(meter = 0, direction = 'right') {

        let center = this.view.getCenter();
        let x = center[0];
        let y = center[1];
        switch (direction) {
            case 'up':
                y += meter;
                break;
            case 'down':
                y -= meter;
                break;
            case 'left':
                x -= meter;
                break;
            case 'right':
                x += meter;
                break;
        }

        const newCenter = [x, y];
        this.view.animate({
            center: newCenter,
            duration: 2000
        });

    }

    /**
     * 创建连接线
     * @param  {Date}   options.id       唯一标识，默认为时间戳 
     * @param  {Array} options.geoCoord 经纬度坐标
     * @param  {Array} options.end      屏幕固定位置像素位置} 
     * @param  {String} options.color    颜色
     * @return {String}                 对象内部id
     */
    drawCable({
        id = new Date().getTime(),
        geoCoord,
        end,
        color = 'red'
    } = {}) {

        let listererObj = this.map.on('postcompose', evt => {

            let ctx = evt.context;
            let piex = this.map.getPixelFromCoordinate(
                mapTool.transform(geoCoord)
            );
            const tmpX = piex[0] > end[0] ? piex[0] - 100 : piex[0] + 100;
            ctx.strokeStyle = color;
            ctx.moveTo(piex[0], piex[1]);
            ctx.lineTo(tmpX, end[1]);
            ctx.lineTo(end[0], end[1]);
            ctx.stroke();

        });
        this.postListenerObj[id] = listererObj;
        return id;

    }


    /**
     * 更新连接线
     * @param  {object}   obj {id:123//唯一标识，默认为时间戳       geoCoord:[]//经纬度坐标      end:[]//屏幕固定位置像素位置}
     */
    updateCable(obj) {

        this.removeCable(obj.id);
        this.drawCable(obj);

    }

    /**
     * 删除连接线
     * @param  {String}   id 唯一标识
     */
    removeCable(id) {

        const listererObj = this.postListenerObj[id];
        this.map.un('postcompose', listererObj.listener);
        delete this.postListenerObj[id];

    }

    /**
     * 空间查询
     * @param  {Array}   geoCoord 中心点坐标
     * @param  {Number}   radius   距离
     * @param  {Function} callback 查询结果回调
     * @param {Object} Object { showRandar:true,//显示雷达 默认true     time:-1 //雷达扫描次数， 默认-1 扫描动画开启后不会消失} 
     */
    spatialQuery(geoCoord, radius, callback, options) {

        this.queryCircle.setQueryFun(result => {

            this.clearTrackInfo(); //该方法进行对查询到的所有轨迹和tooltip进行移除操作。
            this.clearSelect();
            for (let id in result.selected) {

                const array = result.selected[id];

                array.forEach(features => {

                    this.clickSelect.getFeatures().extend(features);

                });

            }

            if (baseUtil.isFunction(callback)) {

                callback(result);

            }

        });

        this.queryCircle.load(geoCoord, radius, options);

    }

    /**
     * 清空查询结果
     */
    clearSpatial() {

        this.queryCircle.clear();
        this.clearSelect();

    }

    /**
     * 清空选中结果
     */
    clearSelect() {

        let collect = this.clickSelect.getFeatures();
        if (collect.getLength() > 0) {

            collect.clear();

        }

    }

    /**
     * 绘制轨迹（依赖路网数据,目前仅提供济南市的测试数据。）
     * @param  {Array} start             起始点
     * @param  {Array} end                结束点
     * @param  {Function} callback   结果回调
     * @param  {Function} tooltipFun 弹出气泡框回调
     * @param  {Boolean} isCustom   是否通用气泡框
     * @param  {String} tbName
     */
    drawTrack(
        start,
        end, {
            dataUrl,
            callback = undefined,
            tooltipFun = undefined,
            isCustom = false,
            tbName = this._geo.routeName
        } = {}
    ) {

        let tooltip = (data) => {

            let overlay = this.createOverlay(null, isCustom);
            overlay.setPosition(mapTool.transform(start));
            let el = overlay.getElement();
            this.trackOverlayArray.push(overlay);
            this.map.addOverlay(overlay);
            tooltipFun(data, el);

        };
        this.routeLayer.setUrl(this._serverUrl);
        this.routeLayer.drawTrack(start, end, {
            dataUrl,
            callback,
            tooltipFun: tooltip,
            isCustom,
            tbName
        });

    }

    _createCircleQuery() {

        this.queryCircle = new Layer.spatialQueryLayer({
            map: this.map,
            queryLayer: this._addLayerGroupArray
        });
        this.on('afterClear', () => {


            this.clearTrackInfo();

        });

    }
    _createtrackLayer() {

        this.routeLayer = new Layer.routeLayer({
            map: this.map
        });
        this.trackOverlayArray = [];

    }

    initTrackData(obj) {

        let trck = new Layer.trackLayer({
            map: this.map,
            id: obj.id
        });

        trck.update(obj);
        return trck;

    }

    /**
     * 清除轨迹查询结果
     */
    clearTrackInfo() {


        this.trackOverlayArray.forEach((overlay) => {

            this.map.removeOverlay(overlay);

        });
        this.trackOverlayArray = [];

        this.routeLayer.clear();

    }

    initgpslayer(options) {

        this.gpslayer = new Layer.gpsLayer({
            map: this.map,
            options
        });

    }

    /**
     * 更新gps数据
     * @param  {Object} data 数据
     */
    updateGps(data) {

        this.gpslayer.update(data);

    }

    /**
     * 绘制查询
     * @param  {String}   type     类型：box,circle,polygon
     * @param  {Function} callback 回调
     */
    draw(type, callback) {

        this.clearSelect();

        this.queryCircle.setQueryFun(result => {

            this.clearSelect();
            this.clearTrackInfo();

            for (let id in result.selected) {

                const array = result.selected[id];
                array.forEach(features => {

                    this.clickSelect.getFeatures().extend(features);

                });

            }

            if (baseUtil.isFunction(callback)) {

                callback(result);

            }

        });

        this.queryCircle.createDraw(type);

    }

    /**
     * 设置半径
     * @param {Number} radius   距离
     * @param {Boolean} relative 是否相对距离
     */
    setRadius(radius, relative) {

        this.queryCircle.setRadius(radius, relative);

    }

    /**
     * 触发事件
     * @param  {Event} evt.type   type: 'geoSelect', || 'geoUnSelect' || 'geoToggleSelect'    name: '天津市和平区'
     * @param {String} evt.id
     */
    dispatchAction(evt) {

        let feature = this.getFeature(evt.id);
        const geoType = this.geoType_[evt.type]['arrayType'];
        let e = {
            type: 'select',
            [geoType]: [feature]
        };
        this.clickSelect.dispatchEvent(e);

    }

    /**
     * 销毁对象
     * @return {null} 
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