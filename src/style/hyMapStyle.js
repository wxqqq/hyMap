import styleModel from '../model/styleModel';

const ol = require('../../public/lib/ol');

export default class hyMapStyle {
    constructor() {

        this._style = styleModel;

    }
    getStyle() {


    }

    getStyleByType(type) {

    }

    getStyleModel() {

        return this._style;

    }


    /**
     * [_createRegionsStyle description]
     * @return {[type]} [description]
     */
    _createRegionsStyle() {

        this._regionsObj = {};
        this._geo.regions.forEach(region => {

            const style = this._createGeoStyle(region.itemStyle);
            this._regionsObj[region.name] = style;

        });

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
     * @param  {[type]} style [description]
     * @return {[type]}       [description]
     */
    _createGeoStyle(itemStyle) {

        const style = this._createItemStyle(itemStyle);
        return {
            normal: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: style.normal.strokeColor,
                    width: style.normal.strokeWitdh
                }),
                fill: new ol.style.Fill({
                    color: style.normal.fillColor
                })
            }),
            emphasis: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: style.emphasis.strokeColor,
                    width: style.emphasis.strokeWitdh
                }),
                fill: new ol.style.Fill({
                    color: style.emphasis.fillColor
                })
            })
        };

    }

    /**
     * [_createStyleModel description]
     * @param  {[type]} serie [description]
     * @return {[type]}       [description]
     */
    _createStyleModel(serie) {

        const symbolStyle = serie.symbolStyle;
        symbolStyle.normal = this._style.normal || symbolStyle.normal;
        symbolStyle.normal.symbol = serie.symbol;
        symbolStyle.normal.symbolSize = serie.symbolSize;
        let styleModel = this._createItemStyle(symbolStyle);
        return styleModel;

    }

    /**
     * 创建feature的样式
     * @param  {[type]} serie [description]
     * @return {[type]}       [description]
     */
    _createStyle(serie) {

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
                text: new ol.style.Text({
                    font: '12px Calibri,sans-serif',
                    fill: new ol.style.Fill({
                        color: '#000'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });

            emphasis = new ol.style.Style({
                image: selectIcon,
                text: new ol.style.Text({
                    font: '12px Calibri,sans-serif',
                    fill: new ol.style.Fill({
                        color: '#000'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 3
                    })
                })
            });

        } else if (serie.type == 'line') {

            normal = this._createLineStyle();
            emphasis = this._createLineStyle();


        } else if (serie.type == 'polygon') {

            normal = this._createLineStyle();
            emphasis = this._createLineStyle();

        }

        const styleObject = {
            normal,
            emphasis
        };

        return styleObject;

    }

    _createCircleStyle(object) {

        let icon = new ol.style.Circle({
            radius: object.radius,
            stroke: new ol.style.Stroke({
                color: object.strokeColor,
                width: object.strokeWidth
            }),
            fill: new ol.style.Fill({
                color: object.fillColor //'rgba(0,255,255,0.3)'
            })
        });
        return icon;

    }

    _createRectStyle(object) {

        let icon = new ol.style.RegularShape({
            fill: new ol.style.Fill({
                color: object.fillColor
            }),
            stroke: new ol.style.Stroke({
                color: object.strokeColor,
                width: object.strokeWidth
            }),
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

    _createLineStyle() {

        let style = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'red'
            }),
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 3
            })
        });
        return style;

    }
}