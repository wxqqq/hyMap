import symbolModel from '../model/symbolModel';
import labelModel from '../model/labelModel';
import baseUtil from '../util/baseUtil';

const ol = require('ol');

export default class hyMapStyle {
    constructor() {

        this._baseIconStyle = symbolModel;
        this._baseLabelStyle = labelModel;
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
        if (rotation) {

            rotation = Number(rotation) / 360 * Math.PI * 2;

        }
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

    _createCircleStyle(radius = 1, fill, stroke) {

        const icon = new ol.style.Circle({
            radius: baseUtil.isArray(radius) ? radius[0] : radius,
            stroke: stroke,
            fill: fill
        });
        return icon;

    }

    _createRectStyle(radius = 1, fill, stroke) {

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

            const imgWidth = img.width;
            const imgHeight = img.height;
            scale = imgWidth / imgHeight;
            ctx.scale(width / imgWidth, width / imgWidth * scale);
            ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

        };
        img.src = src;


        // canvas.setAttribute('width', width);
        // canvas.setAttribute('height', height);
        let icon = new ol.style.Icon({
            anchor: [0.5, 1],
            img: canvas,
            imgSize: [width, width / scale]
        });

        return icon;

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
     * 创建feature的样式
     * @param  {[type]} serie [description]
     * @return {[type]}       [description]
     */
    _createFeatureStyle(serie) {

        let icon = serie.symbolStyle;
        icon.normal.symbol = icon.normal.symbol || serie.symbol;
        icon.normal.symbolSize = icon.normal.symbolSize || serie.symbolSize;
        icon.emphasis.symbol = icon.emphasis.symbol || serie.symbol;
        icon.emphasis.symbolSize = icon.emphasis.symbolSize || serie.symbolSize;
        icon.emphasis = Object.assign({}, icon.normal, icon.emphasis);

        let label = serie.label;
        if (label) {

            label.normal.labelSize = label.normal.labelSize || serie.labelSize;
            label.emphasis.labelSize = label.emphasis.labelSize || serie.labelSize;
            label.emphasis = baseUtil.merge({}, label.normal, label.emphasis, true);

        }

        const style = this._createGeoStyle(icon, label);
        return style;

    }

    /**
     * 创建样式数组对象
     * @param  {[type]} itemStyle      [description]
     * @param  {Object} options.normal [description]
     * @param  {Object} emphasis       [description]
     * @return {[type]}                [description]
     */
    _createGeoStyle(IconStyle, labelStyle) {


        const style = this._createItemStyle(IconStyle, this._baseIconStyle);
        const label = this._createItemStyle(labelStyle, this._baseLabelStyle);

        return {
            normal: this._createDataStyle(style.normal, label.normal),
            emphasis: this._createDataStyle(style.emphasis, label.emphasis)
        };

    }

    /**
     * [_createItemStyle description]
     * @param  {[type]} symbolStyle [description]
     * @return {[type]}             [description]
     */
    _createItemStyle(symbolStyle, style) {

        let styleModel = Object.assign({}, style);

        const normal = Object.assign({}, styleModel.normal, symbolStyle && symbolStyle.normal || {});
        const emphasis = Object.assign({}, normal, symbolStyle && symbolStyle.emphasis || {});
        return {
            normal,
            emphasis
        };

    }
    _createDataStyle(style, label = {}) {

        const stroke = this._createStroke(style.strokeWidth, style.strokeColor);
        const fill = this._createFill(style.fillColor);
        const text = this._createTextStyle(label && label.textStyle || {});
        text.show = label && label.show || false;
        const image = this._createImageStyle(style.symbol, style);
        return this._createStyle(stroke, fill, text, image);

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
     * style回调方法
     * @param  {ol.feature} feature    [description]
     * @param  {array} resolution [description]
     * @param  {String} type  样式类型     [description]
     * @return {[ol.style,ol.style]}  显示的定义样式
     */
    _geoStyleFn(feature, resolution, type = 'normal') {

        const style = feature.get('style') || feature.source.vector.get('fstyle');
        const symbolSize = feature.source.vector.get('fSymbol');
        const rStyle = style[type];
        // console.log(symbolSize, rStyle[0].getImage().getRadius())
        //判断是否对图形大小进行动态设置
        if (symbolSize && symbolSize[0] != symbolSize[1]) {

            const geoScaleNum = feature.source.vector.get('fScaleNum');
            const value = feature.get('value');
            const scale = Math.floor(value / geoScaleNum);
            const icon = rStyle[0].getImage();
            if (icon) {

                if (icon instanceof ol.style.Icon) {

                    // console.log((scale + symbolSize[0]) / symbolSize[0] * icon.getScale(), icon.getImageSize())
                    icon.setScale((scale + symbolSize[0]) / symbolSize[0]);

                } else {

                    icon.setRadius(scale + symbolSize[0]);

                }

            }

        }
        if (type != 'normal') {


        }

        //判断是否需要进行文本标签显示

        const text = rStyle[1].getText();
        if (text && text.show) {

            const textSize = feature.source.vector.get('fText');
            const column = feature.source.get('labelColumn') || 'value';
            text.setText(feature.get(column).toString());
            if (textSize && textSize[0] != textSize[1]) {

                const font = text.getFont().split(' ');
                const textScaleNum = feature.source.vector.get('ftextScaleNum');
                const value = feature.get('value');
                const scale = Math.floor(value / textScaleNum);
                const newFont = scale + textSize[0] - 1;
                font[2] = newFont + 'px';
                text.setFont(font.join(' '));

            }


        }

        return rStyle;

    }

    getFeatureStyle(feature) {

        let style = feature.getStyle && feature.getStyle();
        if (!style) {

            style = typeof feature.source.vector.getStyle() === 'function' ? feature.source.vector.getStyle()(feature) : feature.source.vector.getStyle();

        }
        return style;

    }

    _scaleSize(symbolSize = [], min, max) {

        let a = symbolSize[1] - symbolSize[0] + 1;
        return max / a;

    }
}