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

    _createFill(color = 'rgba(0,0,0,0)') {

        return new ol.style.Fill({
            color: color //'rgba(0,255,255,0.3)'
        });

    }

    _createStroke(width, color = 'rgba(0,0,0,0)') {

        if (width == 0 || isNaN(width)) {

            return null;

        }
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

        let canvas = document.createElement('canvas');

        let ctx = canvas.getContext('2d');
        let img = new Image();
        const width = symbolSize[0];
        let scale = 1;
        img.onload = function() {

            scale = img.width / img.height;
            ctx.scale(width / img.width, width / img.width / scale);
            ctx.drawImage(img, 0, 0, this.width, this.height);

        };
        img.src = src;


        // canvas.setAttribute('width', width);
        // canvas.setAttribute('height', height);
        let icon = new ol.style.Icon({
            anchor: [0.5, 1],
            img: canvas,
            imgSize: [width, width / scale]
        });
        console.log(icon.getImageSize())

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
     * 创建样式数组对象
     * @param  {[type]} itemStyle      [description]
     * @param  {Object} options.normal [description]
     * @param  {Object} emphasis       [description]
     * @return {[type]}                [description]
     */
    _createGeoStyle(itemStyle, label = {}) {


        const style = this._createItemStyle(itemStyle);
        return {
            normal: this._createDataStyle(style.normal, label.normal),
            emphasis: this._createDataStyle(style.emphasis, label.emphasis)
        };

    }

    _createDataStyle(style, label = {}) {

        let text = undefined;
        text = this._createTextStyle(label && label.textStyle || {});
        text.show = label && label.show || false;

        const stroke = this._createStroke(style.strokeWidth, style.strokeColor);
        const image = this._createImageStyle(style.symbol, style);
        const fill = this._createFill(style.fillColor);
        return this._createStyle(stroke, fill, text, image);

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

        symbolStyle.normal.symbol = symbolStyle.normal.symbol || serie.symbol;
        symbolStyle.normal.symbolSize = symbolStyle.normal.symbolSize || serie.symbolSize;

        symbolStyle.emphasis.symbol = symbolStyle.emphasis.symbol || serie.symbol;
        symbolStyle.emphasis.symbolSize = symbolStyle.emphasis.symbolSize || serie.symbolSize;

        symbolStyle.emphasis = Object.assign({}, symbolStyle.normal, symbolStyle.emphasis);
        console.log(symbolStyle)
        const style = this._createGeoStyle(symbolStyle, serie.label);
        return style;

    }

    /**
     * style回调方法
     * @param  {ol.feature} feature    [description]
     * @param  {array} resolution [description]
     * @param  {String} type  样式类型     [description]
     * @return {[ol.style,ol.style]}  显示的定义样式
     */
    _geoStyleFn(feature, resolution, type = 'normal') {

        const vectorStyle = feature.source.vector.get('fstyle');
        const style = feature.get('style') || vectorStyle;
        const symbolSize = feature.source.vector.get('fSymbol');
        const rStyle = style[type];
        // console.log(symbolSize, rStyle[0].getImage().getRadius())
        //判断是否对图形大小进行动态设置
        if (symbolSize && symbolSize[0] != symbolSize[1]) {

            const geoScaleNum = feature.source.vector.get('fScaleNum');
            const value = feature.get('value');
            const scale = Math.floor(value / geoScaleNum);
            const icon = rStyle[0].getImage();
            if (icon instanceof ol.style.Icon) {

                // console.log((scale + symbolSize[0]) / symbolSize[0] * icon.getScale(), icon.getImageSize())
                icon.setScale((scale + symbolSize[0]) / symbolSize[0]);

            } else {

                icon.setRadius(scale + symbolSize[0]);

            }

        }
        if (type != 'normal') {

            console.log(rStyle);

        }

        //判断是否需要进行文本标签显示
        const text = rStyle[1].getText();
        text && text.show && text.setText(feature.get('name'));
        return rStyle;

    }


    _geoSymbolScale(symbolSize, min, max) {

        let a = symbolSize[1] - symbolSize[0] + 1;
        return max / a;

    }
}