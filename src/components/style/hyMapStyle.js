import symbolModel from '../../model/symbolModel';
import labelModel from '../../model/labelModel';
import baseUtil from '../../util/baseUtil';

const ol = require('ol');

export default class hyMapStyle {

    /**
     * [_createTextStyle description]
     * @author WXQ
     * @date    2017-06-15
     * @param   {String}   options.fontStyle    [description]
     * @param   {String}   options.fontWeight   [description]
     * @param   {String}   options.fontSize     [description]
     * @param   {String}   options.fontFamily   [description]
     * @param   {String}   options.offsetX      [description]
     * @param   {String}   options.offsetY      [description]
     * @param   {String}   options.scale        [description]
     * @param   {String}   options.rotation     [description]
     * @param   {String}   options.textAlign    [description]
     * @param   {String}   options.textBaseline [description]
     * @param   {String}   options.color        [description]
     * @param   {String}   options.strokeColor  [description]
     * @param   {Object}   options.strokeWidth                  } [description]
     * @return  {Object}                        [description]
     * @private
     */
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
    } = {}, show = false) {

        if (rotation) {

            rotation = Number(rotation) / 360 * Math.PI * 2;

        }
        let text = new ol.style.Text({
            font: fontStyle + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily,
            offsetX: offsetX,
            offsetY: offsetY,
            scale: scale,
            rotation: rotation,
            textAlign: textAlign,
            textBaseline: textBaseline,
            fill: this._createFill(color),
            stroke: this._createStroke(strokeWidth, strokeColor)

        });
        text.show = show;
        return text;

    }



    _createFill(color = 'rgba(0,0,0,0)') {

        return new ol.style.Fill({
            color: color //'rgba(0,255,255,0.3)'
        });

    }

    _createStroke(width, color = 'rgba(0,0,0,0)', lineDash = undefined) {

        if (width == 0 || isNaN(width)) {

            return null;

        }
        return new ol.style.Stroke({
            width: width,
            color: color,
            lineDash: lineDash

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

    _createImageStyle(styleModel) {

        let image = undefined;
        const symbol = styleModel.symbol;
        const stroke = this._createStroke(styleModel.strokeWidth, styleModel.strokeColor);
        const fill = this._createFill(styleModel.fillColor);
        if (symbol == 'circle') {

            image = this._createCircleStyle(styleModel.symbolSize, fill, stroke);

        } else if (symbol.indexOf('icon:') === 0) {

            const src = symbol.split(':')[1];
            image = this._createIconStyle(src, styleModel.symbolSize, styleModel.color, styleModel.anchor, function(icon) {});

        } else if (symbol == 'rect') {

            image = this._createRectStyle(styleModel.symbolSize, fill, stroke);

        }
        return image;

    }

    /**
     * 创建feature的样式
     * @param  {object} serie [description]
     * @return {Style}       [description]
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
     * @private
     * @param  {Style} itemStyle      [description]
     * @param  {Object} options.normal [description]
     * @param  {Object} emphasis       [description]
     * @return {Object}                [description]
     */
    _createGeoStyle(IconStyle, labelStyle) {


        const style = this._createItemStyle(IconStyle, symbolModel);
        const label = this._createItemStyle(labelStyle, labelModel);

        return {
            normal: this._createDataStyle(style.normal, label.normal),
            emphasis: this._createDataStyle(style.emphasis, label.emphasis)
        };

    }

    /**
     * 创建itemstyle
     * @private
     * @param  {Style} symbolStyle [description]
     * @return {Style}             [description]
     */
    _createItemStyle(symbolStyle, style) {

        const normal = Object.assign({}, style.normal, symbolStyle && symbolStyle.normal || {});
        const emphasis = Object.assign({}, normal, symbolStyle && symbolStyle.emphasis || {});
        return {
            normal,
            emphasis
        };

    }
    _createDataStyle(style, label = {}) {

        const stroke = this._createStroke(style.strokeWidth, style.strokeColor);
        const fill = this._createFill(style.fillColor);
        const text = this._createTextStyle(label.textStyle, label.show);
        const image = this._createImageStyle(style);
        let styles = [
            new ol.style.Style({ //icon
                image: image,
                stroke: stroke,
                fill: fill
            }), new ol.style.Style({ //text
                text: text,
                geometry: (feature) => {

                    let retPoint = feature.getGeometry();
                    if (!retPoint) {

                        return;

                    }

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

    getFeatureStyle(feature) {

        let style = feature.getStyle && feature.getStyle();
        if (!style) {

            style = typeof feature.source.vector.getStyle() === 'function' ? feature.source.vector.getStyle()(feature) : feature.source.vector.getStyle();

        }
        return style;

    }
}