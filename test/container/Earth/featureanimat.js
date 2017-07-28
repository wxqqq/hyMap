/*
 * @Author: wxq
 * @Date:   2017-01-16 17:02:11
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-07-25 09:53:52
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\test\container\Earth\featureanimat.js
 * @File Name: featureanimat.js
 * @Descript: 
 */
'use strict';
import React, { Component } from 'react';
import map from '../../../src/index';

class featureanimat extends Component {
    componentDidMount() {

        var layer = new ol.layer.Tile({
            name: "Natural Earth",
            minResolution: 306,
            source: new ol.source.XYZ({
                url: 'http://{a-d}.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/{z}/{x}/{y}.png',
                attributions: [new ol.Attribution({
                    html: '&copy; <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> '
                })]
            })
        });

        // The map
        var map = new ol.Map({
            target: 'map',
            view: new ol.View({
                zoom: 5,
                center: [166326, 5992663]
            }),
            layers: [layer]
        });

        var style = [new ol.style.Style({

            stroke: new ol.style.Stroke({
                color: [0, 0, 0, 0.3],
                width: 2
            }),
            fill: new ol.style.Fill({
                color: [0, 0, 0, 0.3]
            }),
            zIndex: -1
        }),
            new ol.style.Style({
                image: new ol.style.Icon({
                    size: [70, 105],
                    src: 'test/data/jingli-1.png',
                    scale: 1
                }),
                stroke: new ol.style.Stroke({
                    color: [0, 0, 255],
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: [0, 0, 255, 0.3]
                })
            })
        ];
        // style[1].getImage().getAnchor()[1] += 10;

        // Vector layer
        var source = new ol.source.Vector();
        this.vector = new ol.layer.Vector({
            source: source,
            style: style
        });
        map.addLayer(this.vector);

        // Add a feature on the map



        // Add 10 random features

        this.vector.getSource().clear();
        var ex = map.getView().calculateExtent(map.getSize());
        for (var i = 0; i < 10; i++) {
            setTimeout(() => {
                this.addFeatureAt(
                    [ex[0] + Math.random() * (ex[2] - ex[0]),
                        ex[1] + Math.random() * (ex[3] - ex[1])
                    ])
            }, 1000 * i);
        }
    }


    addFeatureAt(p) {
        var f = new ol.Feature(new ol.geom.Point(p));
        this.vector.getSource().addFeature(f);

        this.vector.animateFeature(f, [new ol.featureAnimation.Zoom({
            speed: 0.8,
            duration: 800,
            side: false
        })]);
    }

    render() {

        return (<div>
          
            <div id = 'map' /> 
            </div>);

    }
}
export default featureanimat;