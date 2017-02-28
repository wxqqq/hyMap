import styleModel from '../model/styleModel';
import labelStyle from '../model/labelStyle';

const ol = require('../../public/lib/ol');

export default class hyMapStyle {
    constructor() {

        this._style = styleModel;
        this._labesStyle = labelStyle;
        this._regionsObj = {};

    }
    getStyle() {


    }

    getStyleByType(type) {

    }

    getStyleModel() {

        return this._style;

    }

    _createTextStyle({
        fontStyle = '',
        fontWeight = '',
        fontSize = '',
        fontFamily = 'Microsoft Yahei',
        offsetX,
        offsetY,
        scale,
        rotation,
        textAlign,
        textBaseline,
        color,
        strokeColor,
        strokeWidth
    } = {}) {

        const font = fontStyle + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily;
        return new ol.style.Text({
            font: font,
            offsetX: offsetX,
            offsetY: offsetY,
            scale: scale,
            rotation: rotation,
            textAlign: textAlign,
            textBaseline: textBaseline,
            fill: this._createFill(color),
            stroke: this._createStroke(strokeWidth, strokeColor)

        });

    }

    _createFill(color = '#333') {

        return new ol.style.Fill({
            color: color //'rgba(0,255,255,0.3)'
        });

    }

    _createStroke(width = 0, color = 'rgba(0,0,0,0)') {

        return new ol.style.Stroke({
            width: width,
            color: color

        });

    }

    _createPolygonStyle(object) {

        const style = new ol.style.Style({
            fill: this._createFill(object.fillColor),
            stroke: this._createStroke(object.strokeWidth, object.strokeColor)
        });
        return style;

    }
    _createCircleStyle(object) {

        let icon = new ol.style.Circle({
            radius: object.radius,
            stroke: this._createStroke(object.strokeWidth, object.strokeColor),
            fill: this._createFill(object.fillColor)
        });
        return icon;

    }

    _createRectStyle(object) {

        let icon = new ol.style.RegularShape({
            stroke: this._createStroke(object.strokeWidth, object.strokeColor),
            fill: this._createFill(object.fillColor),
            points: 4,
            radius: object.radius,
            angle: Math.PI / 4
        });

        return icon;

    }

    _createIconStyle(serie, normal) {

        const canvas = document.createElement('canvas');

        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.src = serie.symbol.split(':')[1];

        img.onload = function() {

            ctx.drawImage(img, 0, 0, normal.symbolSize[0], normal.symbolSize[1]);

        };
        canvas.setAttribute('width', normal.symbolSize[0]);
        canvas.setAttribute('height', normal.symbolSize[1]);
        let icon = new ol.style.Icon({
            // anchor: [0.5, 0.5],
            img: canvas,
            imgSize: [canvas.width, canvas.height]
        });
        return icon;

    }
    _createStyle(stroke, fill, text) {

        return new ol.style.Style({
            fill: fill,
            stroke: stroke,
            text: text
        });

    }

    /**
     * [_createRegionsStyle description]
     * @return {[type]} [description]
     */
    _createRegionsStyle(regions = []) {

        let regionObj = {};
        regions && regions.forEach(region => {

            const style = this._createGeoStyle(region.itemStyle, region.label);
            regionObj[region.name] = style;

        });
        return regionObj;

    }

    /**
     * [_createItemStyle description]
     * @param  {[type]} symbolStyle [description]
     * @return {[type]}             [description]
     */
    _createItemStyle(symbolStyle) {

        let styleModel = Object.assign({}, this._style);
        const normal = Object.assign({}, styleModel.normal, symbolStyle.normal);
        const emphasis = Object.assign({}, styleModel.emphasis, symbolStyle.emphasis);
        return {
            normal,
            emphasis
        };

    }

    /**
     * [_createGeoStyle description]
     * @param  {[type]} itemStyle      [description]
     * @param  {Object} options.normal [description]
     * @param  {Object} emphasis       [description]
     * @return {[type]}                [description]
     */
    _createGeoStyle(itemStyle, {
        normal = {
            show: false
        },
        emphasis = {}
    } = {}) {

        const style = this._createItemStyle(itemStyle);
        let nText = this._createTextStyle(normal.textStyle);
        nText.show = normal.show;
        let eText = this._createTextStyle(emphasis.textStyle);
        eText.show = emphasis.show;
        return {
            normal: this._createStyle(this._createStroke(style.normal.strokeWidth, style.normal.strokeColor), this._createFill(style.normal.fillColor), nText),
            emphasis: this._createStyle(this._createStroke(style.emphasis.strokeWidth, style.emphasis.strokeColor), this._createFill(style.emphasis.fillColor), eText)
        };

    }

    /**
     * [_createStyleModel description]
     * @param  {[type]} serie [description]
     * @return {[type]}       [description]
     */
    _createStyleModel(serie) {

        const symbolStyle = serie.symbolStyle;
        let normal = {
            symbol: serie.symbol,
            symbolSize: serie.symbolSize
        };
        const tmpNormal = Object.assign(normal, symbolStyle.normal);
        symbolStyle.normal = tmpNormal;
        const styleModel = this._createItemStyle(symbolStyle);
        return styleModel;

    }

    /**
     * 创建feature的样式
     * @param  {[type]} serie [description]
     * @return {[type]}       [description]
     */
    _createFeatureStyle(serie) {

        const styleModel = this._createStyleModel(serie);

        let normal;
        let emphasis;

        if (serie.type == 'point') {

            let normalIcon;
            let selectIcon;
            if (serie.symbol == 'circle') {

                normalIcon = this._createCircleStyle(styleModel.normal);
                selectIcon = this._createCircleStyle(styleModel.emphasis);

            } else if (serie.symbol == 'rect') {

                normalIcon = this._createRectStyle(styleModel.normal);
                selectIcon = this._createRectStyle(styleModel.emphasis);

            } else if (serie.symbol.indexOf('icon:') === 0) {

                normalIcon = this._createIconStyle(serie, styleModel.normal);
                selectIcon = this._createIconStyle(serie, styleModel.emphasis);

            }

            normal = new ol.style.Style({
                image: normalIcon,
                text: this._createTextStyle(styleModel.normal)
            });

            emphasis = new ol.style.Style({
                image: selectIcon,
                text: this._createTextStyle(styleModel.emphasis)
            });

        } else {

            normal = this._createPolygonStyle(styleModel.normal);
            emphasis = this._createPolygonStyle(styleModel.emphasis);

        }

        const styleObject = {
            normal,
            emphasis
        };

        return styleObject;

    }
}