import styleModel from '../model/styleModel';
import labelStyle from '../model/labelStyle';
import baseUtil from '../util/baseUtil';

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
            stroke: this._createStroke(strokeWidth, strokeColor),

        });

    }
    getMaxPoly(polys) {

        var polyObj = [];
        //now need to find which one is the greater and so label only this
        for (var b = 0; b < polys.length; b++) {

            polyObj.push({
                poly: polys[b],
                area: polys[b].getArea()
            });

        }
        polyObj.sort(function(a, b) {

            return a.area - b.area;

        });

        return polyObj[polyObj.length - 1].poly;

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

    _createCircleStyle(radius = 3, fill, stroke) {

        const icon = new ol.style.Circle({
            radius: baseUtil.isArray(radius) ? radius[0] : radius,
            stroke: stroke,
            fill: fill
        });
        return icon;

    }

    _createRectStyle(radius = 10, fill, stroke) {

        const icon = new ol.style.RegularShape({
            radius: baseUtil.isArray(radius) ? radius[0] : radius,
            stroke: stroke,
            fill: fill,
            points: 4,
            angle: Math.PI / 4
        });

        return icon;

    }

    _createIconStyle(src, symbolSize) {

        const canvas = document.createElement('canvas');

        let ctx = canvas.getContext('2d');
        let img = new Image();
        const width = symbolSize[0];
        const height = symbolSize[1];
        img.src = src;
        img.onload = function() {

            ctx.drawImage(img, 0, 0, width, height);

        };
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        let icon = new ol.style.Icon({
            anchor: [0.5, 1],
            img: canvas,
            imgSize: [width, height]
        });
        return icon;

    }
    _createStyle(stroke, fill, text, image) {

        return [new ol.style.Style({
            fill: fill,
            stroke: stroke,
            image: image

        }), new ol.style.Style({
            text: text,
            geometry: (feature) => {

                var retPoint;
                if (feature.getGeometry().getType() === 'MultiPolygon') {

                    retPoint = this.getMaxPoly(feature.getGeometry().getPolygons()).getInteriorPoint();

                } else if (feature.getGeometry().getType() === 'Polygon') {

                    retPoint = feature.getGeometry().getInteriorPoint();

                } else {

                    retPoint = feature.getGeometry();

                }
                return retPoint;

            }
        })];

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
        const normal = Object.assign({}, styleModel.normal, symbolStyle && symbolStyle.normal || {});
        const emphasis = Object.assign({}, styleModel.emphasis, symbolStyle && symbolStyle.emphasis || {});
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
    _createGeoStyle(itemStyle, label = {}, symbol = 'circle') {

        const style = this._createItemStyle(itemStyle);
        let nText = undefined;
        let eText = undefined;
        nText = this._createTextStyle(label.normal && label.normal.textStyle || {});
        nText.show = label.normal && label.normal.show || false;
        eText = this._createTextStyle(label.emphasis && label.emphasis.textStyle || {});
        eText.show = label.emphasis && label.emphasis.show || false;
        const nStroke = this._createStroke(style.normal.strokeWidth, style.normal.strokeColor);
        const nFill = this._createFill(style.normal.fillColor);
        const nImage = this._createImageStyle(symbol, style.normal);
        const eStroke = this._createStroke(style.emphasis.strokeWidth, style.emphasis.strokeColor);
        const eFill = this._createFill(style.emphasis.fillColor);
        const eImage = this._createImageStyle(symbol, style.emphasis);
        return {
            normal: this._createStyle(nStroke, nFill, nText, nImage),
            emphasis: this._createStyle(eStroke, eFill, eText, eImage)
        };

    }

    _createImageStyle(symbol, styleModel) {

        let image = undefined;
        const stroke = this._createStroke(styleModel.strokeWidth, styleModel.strokeColor);
        const fill = this._createFill(styleModel.fillColor);
        if (symbol == 'circle') {

            image = this._createCircleStyle(styleModel.symbolSize, fill, stroke);

        } else if (symbol == 'rect') {

            image = this._createRectStyle(styleModel.symbolSize, fill, stroke);

        } else if (symbol.indexOf('icon:') === 0) {

            const src = symbol.split(':')[1];
            image = this._createIconStyle(src, styleModel.symbolSize);

        }
        return image;

    }

    /**
     * 创建feature的样式
     * @param  {[type]} serie [description]
     * @return {[type]}       [description]
     */
    _createFeatureStyle(serie) {

        const symbolStyle = serie.symbolStyle;
        let normal = {
            symbol: serie.symbol,
            symbolSize: serie.symbolSize
        };
        const tmpNormal = Object.assign(normal, symbolStyle.normal);
        symbolStyle.normal = tmpNormal;
        const style = this._createGeoStyle(symbolStyle, serie.label, serie.symbol);
        return style;

    }

    /**
     * [_geoStyleFn description]
     * @param  {[type]} feature    [description]
     * @param  {[type]} resolution [description]
     * @param  {String} type       [description]
     * @return {[type]}            [description]
     */
    _geoStyleFn(feature, resolution, type = 'normal') {

        const vectorStyle = feature.source.vector.get('fstyle');

        const style = feature.get('style') || vectorStyle;
        const text = style[type][1].getText();
        text && text.show && text.setText(feature.get('name'));
        return style[type];

    }
}