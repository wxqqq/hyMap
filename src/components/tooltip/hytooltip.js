import hyMapStyle from '../style/hyMapStyle';
import baseUtil from '../../util/baseUtil';
import events from '../../events/events';

const ol = require('ol');
require('../../../css/popup.css');

export default class hytooltip extends hyMapStyle {
    /**
     * 初始化
     * @private
     * @param  {Object}   options 参数
     */
    constructor(options) {

        super(options);
        this.tooltipShow = false;
        this.tooltipOverLay = undefined;
        this.topOverlay = undefined;
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

    /**
     * [setTooltip description]
     * @param {[type]} options [description]
     */
    setTooltip({
        show = false,
        formatter = undefined,
        enterable = false,
        offset = [0, 0],
        style = undefined,
        triggeron = '',
        isCustom = true
    } = {}) {

        this.tooltipShow = show;
        this.formatter = formatter;
        this.tooltipOffset = offset;
        this.tooltipTriggeron = triggeron;
        this.enterable = enterable;
        this.setTooltipStyle(style);
        this.setTooltipOffset(this.tooltipOffset);
        this.setTooltipPopup(isCustom);

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

        this.tooltipOverLay.getElement().setAttribute('style', styleStr);

    }

    getToolip() {

        return this.tooltipOverLay;

    }

    setTooltipPopup(flag) {

        let element = this._createPopup(flag);
        this.tooltipOverLay.setElement(element);

    }

    setTooltipOffset(offset) {

        this.tooltipOverLay.setOffset(offset);

    }

    /**
     * 创建popup
     * @param {Boolean}  isCustom 默认气泡框
     * @return {Element} 返回dom
     */
    _createPopup(isCustom = true) {


        let container = document.createElement('div');
        container.id = 'hy_popup_' + new Date().getTime();


        if (isCustom) {

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

                this.clickSelect.getFeatures().remove(this.tooltipOverLay.feature);
                this.hideToolTip();
                closer.blur();
                return false;

            };

        }

        return container;

    }

    /**
     * 显示弹出框
     * @param  {Feature} feature [description]
     */
    showToolTip(feature) {

        const div = this.tooltipOverLay.getElement();
        let properties = feature.getProperties();
        properties.id = feature.getId();
        const st = this.formatter(properties, div);
        if (st) {

            baseUtil.isDom(st) ? div.appendChild(st) : div.innerHTML = st;

        }

        this.tooltipOverLay.feature = feature;
        const geometry = feature.getGeometry();
        const type = geometry.getType();

        const coordinate = type == 'Polygon' ? geometry.getInteriorPoint().getCoordinates() : geometry.getCoordinates();
        this.tooltipOverLay.setPosition(coordinate);

    }

    /**
     * 隐藏提示框
     */
    hideToolTip() {

        this.tooltipOverLay.setPosition(undefined);
        this.tooltipOverLay.set('trigger', undefined);

    }

    /**
     * 创建popup
     * @private
     * @param  {Element} element dom对象
     * @param {Boolean} isCustomn 是否为默认样式
     * @return {Overlay}        
     */
    createOverlay(element, isCustom = true) {

        element = element || this._createPopup(isCustom);
        let overlay = new ol.Overlay({
            id: 'hy-overly-popup',
            stopEvent: false,
            element: element,
            positioning: 'bottom-center',
            offset: [0, -20],
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });
        //注册事件响应
        element.addEventListener('click', e => {

            if (this.topOverlay) {

                this.topOverlay.style.zIndex = '';

            }
            this.topOverlay = overlay.getElement().parentNode;
            this.topOverlay.style.zIndex = 999;
            this.dispatchEvent({
                evt: e,
                type: 'tooltipClick',
                // data: properties,
                // feature: unSelFeatures
                select: e.target
            });

        });
        this.map.addOverlay(overlay);
        return overlay;

    }

    /**
     * 移除
     * @param   {Overlay} overlay [description]
     * @private
     */
    _reomoveOverlay(overlay) {

        this.map.removeOverlay(overlay);

    }

    /**
     * 全部移除
     * @private
     */
    _removeMarkerOverlay() {

        this._markerLayer.forEach((obj) => {

            this._reomoveOverlay(obj);

        });

    }

    /**
     * 创建交互
     * @private
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

                if (layer.get('type') && !layer.get('interior')) {

                    return true;

                }

            }
        });
        this.map.addInteraction(this.clickSelect);
        this.clickSelect.on('select', (evt) => this._clickFun(evt));

    }

    /**
     * 创建hover交互
     * @private
     */
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

                    flag = this.isEnter(this.tooltipOverLay.getElement(), evt.pixel);

                }

                return evt.type === 'pointermove' && !flag;

            },
            hitTolerance: 2,
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
        evt.interaction = evt.target;
        // click, mouseover, mousemove, dblclick
        if (unSelFeatures && unSelFeatures.length > 0) {

            const unSelFeature = unSelFeatures[0];
            // unSelFeature.set('emphasis', false);
            const properties = unSelFeature.getProperties();
            const layer = unSelFeature.source.vector;
            const layerType = layer.get('type');
            const type = (layer.get('type') && layer.get('type') === 'geo') ? 'geoUnSelect' : 'unClick';

            this.hideToolTip();

            evt.target.getFeatures().remove(unSelFeature);
            let event = {
                evt: evt.mapBrowserEvent,
                type: type,
                data: properties,
                feature: unSelFeatures
                    // select: evt.target
            };

            unSelFeature.source.vector.dispatchEvent(event);

            this.dispatchEvent(event);

        }
        if (selFeatures && selFeatures.length > 0) {

            const selFeature = selFeatures[0];
            // selFeature.set('emphasis', true);
            //从鼠标移上的效果中移除。
            // this.hoverSelect.getFeatures().remove(selFeature);
            const layer = selFeature.source.vector;
            let properties = selFeature.getProperties();
            properties.id = selFeature.getId();
            const layerType = layer.get('type');
            let type = 'click';
            if (!layer.get('interior') && this.tooltipShow && this.tooltipTriggeron.indexOf('click') > -1) {

                this.showToolTip(selFeature);

            }
            evt.target.getFeatures().get('length') == 0 && evt.target.getFeatures().push(selFeature);
            // evt.target.getFeatures().remove(selFeature);
            let event = {
                evt: evt.mapBrowserEvent,
                type: type,
                data: properties,
                layerid: selFeature.source.vector.get('layerId'),
                feature: selFeature
                    // select: evt.target,
            };
            if (layerType == 'geo') {

                event.type = 'geoSelect';
                selFeature.source.vector.dispatchEvent(evt);

            } else {

                selFeature.source.vector.dispatchEvent(event);

            }

            this.dispatchEvent(event);


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
            if (this.tooltipTriggeron.indexOf('mouseover') > -1) {

                window.clearTimeout(() => this.timer);
                this.timer = window.setTimeout(() => this.hideToolTip(), 600);

            }
            if (!layer.get('interior') && this.tooltipShow && this.tooltipTriggeron.indexOf('mouseout') > -1) {


                this.showToolTip(unSelFeature);

            }
            evt.target.getFeatures().remove(unSelFeature);

            let event = {
                evt: evt.mapBrowserEvent,
                type: type,
                data: properties,
                feature: unSelFeatures
                    // select: evt.target
            };


            unSelFeature.source.vector.dispatchEvent(event);

            this.dispatchEvent(event);

        }
        if (selFeatures && selFeatures.length > 0) {

            const selFeature = selFeatures[0];

            const layer = selFeature.source.vector;
            let properties = selFeature.getProperties();
            properties.id = selFeature.getId();
            const layerType = layer.get('type');
            const type = (layer.get('type') && layer.get('type') === 'geo') ? 'geoHover' : 'hover';
            if (!layer.get('interior') && this.tooltipShow && this.tooltipTriggeron.indexOf('mouseover') > -1) {

                // && (layer.get('showPopup') || layer.get('showPopup') === 'true')) {
                // evt.target.addCondition_ = () => (true);

                window.clearTimeout(() => this.timer);
                this.showToolTip(selFeature);

            }
            evt.target.getFeatures().get('length') == 0 && evt.target.getFeatures().push(selFeature);
            let event = {
                evt: evt.mapBrowserEvent,
                type: type,
                data: properties,
                feature: selFeature
                    // select: evt.target,
            };
            if (layerType != 'geo') {

                selFeature.source.vector.dispatchEvent(event);

            }
            // if (selFeature.get('emphasis')) {

            // evt.target.getFeatures().remove(selFeature);

            // }
            this.dispatchEvent(event);

        }

    }

    /**
     * style回调方法
     * @param  {ol.feature} feature    [description]
     * @param  {array} resolution [description]
     * @param  {String} type  样式类型     [description]
     * @return {Style}  显示的定义样式
     */
    _geoStyleFn(feature, resolution, type = 'normal') {

        const style = feature.get('style') || feature.source.vector.get('fstyle');
        const rStyle = style[type];
        const serie = feature.source.vector.get('serie');
        const symbolSize = serie && serie.symbolSize;
        const serieType = serie && serie.type;

        //判断是否对图形大小进行动态设置
        if (symbolSize && symbolSize[0] != symbolSize[1]) {

            let geoScaleNum = this._scaleSize(symbolSize, feature.source.get('minValue'), feature.source.get('maxValue'));
            let value = feature.get('value') || 0;
            //对数据进行判断，
            if (feature.source instanceof ol.source.Cluster) {

                geoScaleNum = this._scaleSize(symbolSize, feature.source.getSource().get('minValue'), feature.source.getSource().get('maxValue'));

                const features = feature.get('features');

                if (features) {

                    features.forEach((feature) => {

                        let fValue = feature.get('value');
                        if (fValue > value) {

                            value = fValue;

                        }

                    });

                } else {

                    value = feature.get('value');

                }

            }
            const scale = Math.floor(value / geoScaleNum);
            const icon = rStyle[0].getImage();
            if (icon) {

                if (icon instanceof ol.style.Icon) {

                    icon.setScale((symbolSize[0] + scale) / (symbolSize[0] / icon.relScale));

                } else {

                    icon.setRadius(scale + symbolSize[0]);

                }

            }

        }

        //判断是否需要进行文本标签显示
        const text = rStyle[1].getText();
        if (text && text.show) {

            const textSize = serie && serie.labelSize;
            const column = serie && serie.labelColumn || 'value';
            let value = '';
            let textScaleNum = this._scaleSize(textSize, feature.source.get('minValue'), feature.source.get('maxValue'));

            if (feature.source instanceof ol.source.Cluster) {

                textScaleNum = this._scaleSize(textSize, feature.source.getSource().get('minValue'), feature.source.getSource().get('maxValue'));

                const features = feature.get('features');

                if (features) {

                    features.forEach((feature) => {

                        let fValue = feature.get(column);
                        if (fValue > value) {

                            value = fValue;

                        }

                    });

                } else {

                    value = feature.get(column);

                }

            } else {

                value = feature.get(column);

            }
            text.setText(value.toString());
            if (textSize && textSize[0] != textSize[1]) {

                const font = text.getFont().split(' ');
                const value = feature.get(column);
                const scale = Math.floor(value / textScaleNum);
                const newFont = scale + textSize[0] - 1;
                font[2] = newFont + 'pt';
                text.setFont(font.join(' '));

            }

        }

        return rStyle;

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