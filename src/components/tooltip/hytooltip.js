import hyMapStyle from '../style/hyMapStyle';
import baseUtil from '../../util/baseUtil';
import events from '../../events/events';

const ol = require('ol');
require('../../../css/popup.css');
export default class hytooltip extends hyMapStyle {
    constructor(options) {

        super(options);

        this.tooltipShow = false;
        this._overlay = null;
        this.tooltipTrigger = undefined;
        this.formatter = () => undefined;
        this.tooltipTriggeron = '';
        this.enterable = false;
        this.triggerType = {

            'click': 'singleclick',
            'dbclick': 'doubleClick',
            'mouseover': 'pointermove',
            'mouseout': 'pointermove'
        };

    }

    _createIntercation() {

        this._createHoverInteraction();
        this._createSelectInteraction();

    }
    setTooltip(options) {

        const opt = options || {};
        this.tooltipShow = opt.show || false;
        this.formatter = baseUtil.isFunction(opt.formatter) ? opt.formatter : undefined;
        this.tooltipOffset = baseUtil.isFunction(opt.position) ? opt.position : [0, 0];
        this.tooltipTrigger = opt.trigger || undefined;
        this.tooltipTriggeron = opt.triggeron || '';
        this.enterable = opt.enterable || false;
        this.setTooltipStyle(opt.style);
        baseUtil.isFunction(opt.tooltipOffset) && this.setTooltipOffset(this.tooltipOffset);

    }

    setTooltipStyle(styleObject) {

        // const reg = new RegExp(/^\{(.*)\}$/);
        // const reg1 = new RegExp(/\"/g);
        // const reg2 = new RegExp(/\,/g);
        // const styleStr = JSON.stringify(styleObject).replace(reg, '$1').replace(reg1, "").replace(reg2, ';');
        let styleStr = '';
        for (const i in styleObject) {


            styleStr += i + ':' + (isNaN(styleObject[i]) ? styleObject[i] : styleObject[i] + 'px') + ';';

        }

        this._overlay.getElement().setAttribute('style', styleStr);

    }

    getToolip() {

    }

    setPopupStyle() {

    }

    setTooltipOffset(offset) {

        if (offset) {

            this._overlay.setOffset(offset());

        }

    }

    /**
     * 创建popup
     * @return {[type]} [description]
     */
    _createPopup() {

        let container = document.createElement('div');
        container.id = 'popup';
        container.className = 'ol-popup';
        let closer = document.createElement('div');
        closer.id = 'popup-closer';
        closer.className = 'ol-popup-closer';
        container.appendChild(closer);
        let content = document.createElement('div');
        content.id = 'hy-popup-content';
        container.appendChild(content);
        document.body.appendChild(container);
        closer.onclick = () => {

            this.clickSelect.getFeatures().remove(this._overlay.feature);
            this._hideOverlay();
            closer.blur();
            return false;

        };


        container.addEventListener('click', (e) => {

            this.dispatchEvent({
                evt: e,
                type: 'tooltipClick',
                // data: properties,
                // feature: unSelFeatures
                select: e.target
            });

        });

        return container;

    }

    /**
     * [_showOverlay description]
     * @return {[type]} [description]
     */
    _showOverlay(feature) {

        this._overlay.feature = feature;
        const geometry = feature.getGeometry();
        const type = geometry.getType();

        const coordinate = type == 'Polygon' ? geometry.getInteriorPoint().getCoordinates() : geometry.getCoordinates();
        this._overlay.setPosition(coordinate);

    }

    /**
     * hide popup
     * @return {[type]} [description]
     */
    _hideOverlay() {

        this._overlay.setPosition(undefined);
        this._overlay.set('trigger', undefined);

    }

    /**
     * create popup
     * @param  {[type]} element [description]
     * @return {[type]}         [description]
     */
    _createOverlay(element) {

        element = element || this._createPopup();
        let _overlay = new ol.Overlay({
            id: 'hy-overly-popup',
            element: element,
            positioning: 'bottom-center',
            offset: [0, -20],
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });
        this.map.addOverlay(_overlay);
        return _overlay;

    }

    _reomoveOverlay(overlay) {

        this.map.removeOverlay(overlay);

    }

    _removeMarkerOverlay() {

        this._markerLayer.forEach((obj) => {

            this._reomoveOverlay(obj);

        });

    }

    /**
     * 
     * @return {[type]} [description]
     */
    _createSelectInteraction() {

        this.clickSelect = new ol.interaction.Select({
            style: (feature) => {

                if (feature.source.vector instanceof ol.layer.Heatmap) {

                    return this._geoStyleFn(feature, '', 'emphasis');

                }

                return typeof feature.source.vector.getStyle() === 'function' ? feature.source.vector.getStyle()(feature, '', 'emphasis') : feature.source.vector.getStyle();

            },
            layers: function(layer) {

                if (layer.get('type')) {

                    return true;

                }

            }
        });
        this.map.addInteraction(this.clickSelect);
        this.clickSelect.on('select', (evt) => this._clickFun(evt));

    }

    _createHoverInteraction() {

        this.hoverSelect = new ol.interaction.Select({
            style: (feature) => {

                if (feature.source) {

                    if (feature.source.vector instanceof ol.layer.Heatmap) {

                        return this._geoStyleFn(feature, '', 'emphasis');

                    }

                    return typeof feature.source.vector.getStyle() === 'function' ? feature.source.vector.getStyle()(feature, '', 'emphasis') : feature.source.vector.getStyle();

                }

            },

            condition: (evt) => {

                let flag = false;
                if (this.enterable) {

                    flag = this.isEnter(this._overlay.getElement(), evt.pixel);

                }

                return evt.type === 'pointermove' && !flag;

            },
            layers: function(layer) {

                if (layer.get('type')) {

                    return true;

                }

            }
        });
        this.map.addInteraction(this.hoverSelect);
        this.hoverSelect.on('select', (evt) => this._hoverFun(evt));

    }


    _clickFun(evt) {

        const selFeatures = evt.selected;
        const unSelFeatures = evt.deselected;
        // click, mouseover, mousemove, dblclick
        if (unSelFeatures && unSelFeatures.length > 0) {

            const unSelFeature = unSelFeatures[0];
            const properties = unSelFeature.getProperties();
            const layer = unSelFeature.source.vector;
            const layerType = layer.get('type');
            const type = (layer.get('type') && layer.get('type') === 'geo') ? 'geoUnSelect' : 'unClick';

            this._hideOverlay();

            evt.target.getFeatures().remove(unSelFeature);
            let event = {
                evt: evt.mapBrowserEvent,
                type: type,
                data: properties,
                feature: unSelFeatures
                    // select: evt.target
            };
            if (layerType != 'geo') {

                unSelFeature.source.vector.parent.parent.dispatchEvent(event);

            }
            this.dispatchEvent(event);

        }
        if (selFeatures && selFeatures.length > 0) {

            const selFeature = selFeatures[0];
            const layer = selFeature.source.vector;
            let properties = selFeature.getProperties();
            properties.id = selFeature.getId();
            const layerType = layer.get('type');
            let type = 'click';
            let div = null;
            if (!layer.get('interior') && this.tooltipShow && this.tooltipTrigger.indexOf(layerType) > -1 && this.tooltipTriggeron.indexOf('click') > -1) {

                // && (layer.get('showPopup') || layer.get('showPopup') === 'true')) {
                // evt.target.addCondition_ = () => (true);
                div = this._overlay.getElement();
                const st = this.formatter(properties);
                baseUtil.isDom(st) ? div.appendChild(st) : div.innerHTML = st;
                this._showOverlay(selFeature);

            }
            evt.target.getFeatures().get('length') == 0 && evt.target.getFeatures().push(selFeature);
            // evt.target.getFeatures().remove(selFeature);
            let event = {
                evt: evt.mapBrowserEvent,
                type: type,
                data: properties,
                layerid: selFeature.source.vector.get('layerId'),
                feature: selFeature,
                // select: evt.target,
                element: div
            };
            if (layerType == 'geo') {

                event.type = 'geoSelect';
                if (this.geoDrillDown) {

                    this.geoGo(properties);

                }

                // evt.target.getFeatures().remove(selFeature)

            } else {

                selFeature.source.vector.parent.parent.dispatchEvent(event);

            }


            this.dispatchEvent(event);
            this.hoverSelect.getFeatures().remove(selFeature)


        }

    }
    _hoverFun(evt) {

        const selFeatures = evt.selected;
        const unSelFeatures = evt.deselected;
        // click, mouseover, mousemove, dblclick
        if (unSelFeatures && unSelFeatures.length > 0) {

            const unSelFeature = unSelFeatures[0];
            const properties = unSelFeature.getProperties();
            const layer = unSelFeature.source.vector;
            const layerType = layer.get('type');
            const type = (layer.get('type') && layer.get('type') === 'geo') ? 'geoUnHover' : 'unHover';
            if (this.tooltipTriggeron.indexOf('mouseover') > -1 && this.tooltipTrigger.indexOf(layerType) > -1) {

                window.clearTimeout(() => this.timer);
                this.timer = window.setTimeout(() => this._hideOverlay(), 600);


            }
            if (!layer.get('interior') && this.tooltipShow && this.tooltipTrigger.indexOf(layerType) > -1 && this.tooltipTriggeron.indexOf('mouseout') > -1) {

                let div = this._overlay.getElement();
                const st = this.formatter(properties);
                baseUtil.isDom(st) ? div.appendChild(st) : div.innerHTML = st;
                this._showOverlay(unSelFeature);

            }
            evt.target.getFeatures().remove(unSelFeature);

            let event = {
                evt: evt.mapBrowserEvent,
                type: type,
                data: properties,
                feature: unSelFeatures
                    // select: evt.target
            };

            if (layerType != 'geo') {

                unSelFeature.source.vector.parent.parent.dispatchEvent(event);

            }
            this.dispatchEvent(event);

        }
        if (selFeatures && selFeatures.length > 0) {

            const selFeature = selFeatures[0];
            const layer = selFeature.source.vector;
            let properties = selFeature.getProperties();
            properties.id = selFeature.getId();
            const layerType = layer.get('type');
            const type = (layer.get('type') && layer.get('type') === 'geo') ? 'geoHover' : 'hover';
            let div = null;
            if (!layer.get('interior') && this.tooltipShow && this.tooltipTrigger.indexOf(layerType) > -1 && this.tooltipTriggeron.indexOf('mouseover') > -1) {

                // && (layer.get('showPopup') || layer.get('showPopup') === 'true')) {
                // evt.target.addCondition_ = () => (true);
                div = this._overlay.getElement();
                const st = this.formatter(properties);
                baseUtil.isDom(st) ? div.appendChild(st) : div.innerHTML = st;
                window.clearTimeout(() => this.timer);
                this._showOverlay(selFeature);

            }
            evt.target.getFeatures().get('length') == 0 && evt.target.getFeatures().push(selFeature);
            let event = {
                evt: evt.mapBrowserEvent,
                type: type,
                data: properties,
                feature: selFeature,
                // select: evt.target,
                element: div
            };
            if (layerType != 'geo') {

                selFeature.source.vector.parent.parent.dispatchEvent(event);

            }
            this.dispatchEvent(event);


        }

    }
    isEnter(div, event) {

        var x = event[0];
        var y = event[1];
        var div1 = div.parentNode;
        var divx1 = div.offsetLeft + div1.offsetLeft;
        var divy1 = div.offsetTop + div1.offsetTop;
        var divx2 = divx1 + div.offsetWidth;
        var divy2 = divy1 + div.offsetHeight;
        if (x < divx1 || x > divx2 || y < divy1 || y > divy2) {

            return false;

        } else {

            return true;

        }

    }
}
Object.assign(hytooltip.prototype, events);