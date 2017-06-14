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

    _createIconStyle(src, symbolSize, color, anchor = [0.5, 0.5], callback) {


        let icon = new ol.style.Icon({
            anchor: anchor,
            // img: canvas,
            // imgSize: [width, width / scale]
            src: src,
            // size: [70, 105],
            color: color,
            scale: 1

        });
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        const width = symbolSize[0];
        let scale = 1;
        let img = new Image();
        img.src = src;
        if (img.complete) {

            const imgWidth = img.width;
            const imgHeight = img.height;

            let iconScale = width / imgWidth;

            // icon = new ol.style.Icon({
            //     anchor: anchor,
            //     src: src,
            //     size: [imgWidth, imgHeight],
            //     color: color,
            //     scale: iconScale
            // });
            icon.relScale = iconScale;
            icon.setScale(iconScale);
            callback(icon)

        } else {

            img.onload = function() {

                const imgWidth = img.width;
                const imgHeight = img.height;
                scale = imgWidth / imgHeight;
                ctx.scale(width / imgWidth, width / imgWidth * scale);
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

                let iconScale = width / imgWidth;

                img.onload = null;
                // new ol.style.Icon({
                //     anchor: anchor,
                //     src: src,
                //     size: [imgWidth, imgHeight],
                //     color: color,
                //     scale: iconScale
                // });
                icon.relScale = iconScale;
                icon.setScale(iconScale);
                callback(icon)

            };
        }

        // canvas.setAttribute('width', width);
        // canvas.setAttribute('height', height);
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
            image = this._createIconStyle(src, styleModel.symbolSize, styleModel.color, styleModel.anchor, function(icon) {
                // console.log(icon)
            });

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
        icon.emphasis = baseUtil.mergeAll([{}, icon.normal, icon.emphasis], true);
        let label = serie.label;
        if (label) {

            label.normal.labelSize = label.normal.labelSize || serie.labelSize;
            label.emphasis.labelSize = label.emphasis.labelSize || serie.labelSize;
            label.emphasis = baseUtil.mergeAll([{}, label.normal, label.emphasis], true);

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
        let styles = [
            new ol.style.Style({
                image: image,
                stroke: stroke,
                fill: fill
            }), new ol.style.Style({
                text: text,
                geometry: (feature) => {

                    let retPoint = feature.getGeometry();
                    let type = retPoint.getType();
                    if (type === 'MultiPolygon') {

                        retPoint = this.getMaxPoly(retPoint.getPolygons()).getInteriorPoint();

                    } else if (type === 'Polygon') {

                        retPoint = retPoint.getInteriorPoint();

                    }
                    return retPoint;

                }
            })
        ];
        return styles;

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

    /**
     * style回调方法
     * @param  {ol.feature} feature    [description]
     * @param  {array} resolution [description]
     * @param  {String} type  样式类型     [description]
     * @return {[ol.style,ol.style]}  显示的定义样式
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