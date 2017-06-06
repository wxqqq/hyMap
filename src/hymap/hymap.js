import hymapOption from '../model/mapModel';
import hyLayerGroup from '../components/hyLayerGroup';
import baseUtil from '../util/baseUtil';
import events from '../events/events';
import hyGeo from '../components/geo/geo';
import hymap from '../components/map';
import animation from '../animation/animation';
import mapTool from '../util/mapToolUtil';
import gpsLayer from '../components/layer/gpsLayer';
import hyView from '../components/view';
import hyMeasure from '../components/hyMeasure';
import trackLayer from '../components/layer/trackLayer';
import circleQueryLayer from '../components/layer/circelQueryLayer';

const ol = require('ol');
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

        this.clickSelect.getFeatures().clear();
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

                    const coords = feature.getGeometry().getCoordinates();
                    if (geom.intersectsCoordinate(coords)) {

                        feature.set('pixel', this.map.getPixelFromCoordinate(coords));
                        array.push(feature);
                        this.clickSelect.getFeatures().push(feature);

                    }

                });


            });

        }

        return new Promise(function(resolve, resject) {

            resolve(result);

        });

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

                    this._createTrackOverLay(start, str, isCustom);

                }

            }

        }).catch(function(e) {

            console.log(e);

        });

    }

    _createTrackOverLay(coordinate, str, isCustom) {

        let d;
        if (isCustom) {

            d = document.createElement('div');

        }

        let overlay = this._createOverlay(d);
        let div = overlay.getElement();
        div.innerHTML = str;
        overlay.setPosition(mapTool.transform(coordinate));
        this.trackOverlayArray.push(overlay);

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

        // var polyline = [
        //     'hldhx@lnau`BCG_EaC??cFjAwDjF??uBlKMd@}@z@??aC^yk@z_@se@b[wFdE??wFfE}N',
        //     'fIoGxB_I\\gG}@eHoCyTmPqGaBaHOoD\\??yVrGotA|N??o[N_STiwAtEmHGeHcAkiA}^',
        //     'aMyBiHOkFNoI`CcVvM??gG^gF_@iJwC??eCcA]OoL}DwFyCaCgCcCwDcGwHsSoX??wI_E',
        //     'kUFmq@hBiOqBgTwS??iYse@gYq\\cp@ce@{vA}s@csJqaE}{@iRaqE{lBeRoIwd@_T{]_',
        //     'Ngn@{PmhEwaA{SeF_u@kQuyAw]wQeEgtAsZ}LiCarAkVwI}D??_}RcjEinPspDwSqCgs@',
        //     'sPua@_OkXaMeT_Nwk@ob@gV}TiYs[uTwXoNmT{Uyb@wNg]{Nqa@oDgNeJu_@_G}YsFw]k',
        //     'DuZyDmm@i_@uyIJe~@jCg|@nGiv@zUi_BfNqaAvIow@dEed@dCcf@r@qz@Egs@{Acu@mC',
        //     'um@yIey@gGig@cK_m@aSku@qRil@we@{mAeTej@}Tkz@cLgr@aHko@qOmcEaJw~C{w@ka',
        //     'i@qBchBq@kmBS{kDnBscBnFu_Dbc@_~QHeU`IuyDrC_}@bByp@fCyoA?qMbD}{AIkeAgB',
        //     'k_A_A{UsDke@gFej@qH{o@qGgb@qH{`@mMgm@uQus@kL{_@yOmd@ymBgwE}x@ouBwtA__',
        //     'DuhEgaKuWct@gp@cnBii@mlBa_@}|Asj@qrCg^eaC}L{dAaJ_aAiOyjByH{nAuYu`GsAw',
        //     'Xyn@ywMyOyqD{_@cfIcDe}@y@aeBJmwA`CkiAbFkhBlTgdDdPyiB`W}xDnSa}DbJyhCrX',
        //     'itAhT}x@bE}Z_@qW_Kwv@qKaaAiBgXvIm}A~JovAxCqW~WanB`XewBbK{_A`K}fBvAmi@',
        //     'xBycBeCauBoF}}@qJioAww@gjHaPopA_NurAyJku@uGmi@cDs[eRaiBkQstAsQkcByNma',
        //     'CsK_uBcJgbEw@gkB_@ypEqDoqSm@eZcDwjBoGw`BoMegBaU_`Ce_@_uBqb@ytBwkFqiT_',
        //     'fAqfEwe@mfCka@_eC_UmlB}MmaBeWkkDeHwqAoX}~DcBsZmLcxBqOwqE_DkyAuJmrJ\\o',
        //     '~CfIewG|YibQxBssB?es@qGciA}RorAoVajA_nAodD{[y`AgPqp@mKwr@ms@umEaW{dAm',
        //     'b@umAw|@ojBwzDaaJsmBwbEgdCsrFqhAihDquAi`Fux@}_Dui@_eB_u@guCuyAuiHukA_',
        //     'lKszAu|OmaA{wKm}@clHs_A_rEahCssKo\\sgBsSglAqk@yvDcS_wAyTwpBmPc|BwZknF',
        //     'oFscB_GsaDiZmyMyLgtHgQonHqT{hKaPg}Dqq@m~Hym@c`EuiBudIabB{hF{pWifx@snA',
        //     'w`GkFyVqf@y~BkoAi}Lel@wtc@}`@oaXi_C}pZsi@eqGsSuqJ|Lqeb@e]kgPcaAu}SkDw',
        //     'zGhn@gjYh\\qlNZovJieBqja@ed@siO{[ol\\kCmjMe\\isHorCmec@uLebB}EqiBaCg}',
        //     '@m@qwHrT_vFps@kkI`uAszIrpHuzYxx@e{Crw@kpDhN{wBtQarDy@knFgP_yCu\\wyCwy',
        //     'A{kHo~@omEoYmoDaEcPiuAosDagD}rO{{AsyEihCayFilLaiUqm@_bAumFo}DgqA_uByi',
        //     '@swC~AkzDlhA}xEvcBa}Cxk@ql@`rAo|@~bBq{@``Bye@djDww@z_C_cAtn@ye@nfC_eC',
        //     '|gGahH~s@w}@``Fi~FpnAooC|u@wlEaEedRlYkrPvKerBfYs}Arg@m}AtrCkzElw@gjBb',
        //     'h@woBhR{gCwGkgCc[wtCuOapAcFoh@uBy[yBgr@c@iq@o@wvEv@sp@`FajBfCaq@fIipA',
        //     'dy@ewJlUc`ExGuaBdEmbBpBssArAuqBBg}@s@g{AkB{bBif@_bYmC}r@kDgm@sPq_BuJ_',
        //     's@{X_{AsK_d@eM{d@wVgx@oWcu@??aDmOkNia@wFoSmDyMyCkPiBePwAob@XcQ|@oNdCo',
        //     'SfFwXhEmOnLi\\lbAulB`X_d@|k@au@bc@oc@bqC}{BhwDgcD`l@ed@??bL{G|a@eTje@',
        //     'oS~]cLr~Bgh@|b@}Jv}EieAlv@sPluD{z@nzA_]`|KchCtd@sPvb@wSb{@ko@f`RooQ~e',
        //     '[upZbuIolI|gFafFzu@iq@nMmJ|OeJn^{Qjh@yQhc@uJ~j@iGdd@kAp~BkBxO{@|QsAfY',
        //     'gEtYiGd]}Jpd@wRhVoNzNeK`j@ce@vgK}cJnSoSzQkVvUm^rSgc@`Uql@xIq\\vIgg@~k',
        //     'Dyq[nIir@jNoq@xNwc@fYik@tk@su@neB}uBhqEesFjoGeyHtCoD|D}Ed|@ctAbIuOzqB',
        //     '_}D~NgY`\\um@v[gm@v{Cw`G`w@o{AdjAwzBh{C}`Gpp@ypAxn@}mAfz@{bBbNia@??jI',
        //     'ab@`CuOlC}YnAcV`@_^m@aeB}@yk@YuTuBg^uCkZiGk\\yGeY}Lu_@oOsZiTe[uWi[sl@',
        //     'mo@soAauAsrBgzBqgAglAyd@ig@asAcyAklA}qAwHkGi{@s~@goAmsAyDeEirB_{B}IsJ',
        //     'uEeFymAssAkdAmhAyTcVkFeEoKiH}l@kp@wg@sj@ku@ey@uh@kj@}EsFmG}Jk^_r@_f@m',
        //     '~@ym@yjA??a@cFd@kBrCgDbAUnAcBhAyAdk@et@??kF}D??OL'
        // ].join('');
        // this.initTrackData(polyline);

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