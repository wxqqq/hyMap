/*
 * @Author: wxq
 * @Date:   2017-01-16 17:02:11
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-08-30 18:47:15
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\test\container\Earth\icon.js
 * @File Name: icon.js
 * @Descript: 
 */
'use strict';
import React, {
    Component
} from 'react';
import map from '../../../src/index';

class icon extends Component {
    componentDidMount() {

        let mapObj = map.init(document.getElementById('map'));
        let options = {
            serverUrl: 'http://192.168.1.50:8080/geoserver',
            show: true, //地图的显示状态 true为显示 false 为不显示
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            zoom: 6, //当前地图缩放比例
            scaleLimit: [3, 20], //滚轮缩放的边界
            theme: 'dark', //地图风格/地图风格
            series: []
        };
        const series = [];
        mapObj.setOption(options);
        mapObj.setTooltip({
            show: true,
            triggeron: ['click'], //'click', // click, mouseover, ['click'],
            enterable: true, //true 鼠标是否可进入浮出泡泡框中
            isCustom: true,
            style: {
                'border-color': '#cc0',
                'border-radius': '5',
                'border-width': '2',
                'border-style': 'solid',
                width: '80',
                height: '30'
            },
            formatter: function(param, dom) {
                //div内的内容

                dom = document.createElement('div');
                let str = '<a id=1>sss</a>' + param.dataIndex + ': ' + param.value;
                // return str;
            },
            position: function() {
                //相对于当前事件点的位置

                return [0, 0];
                // return [20, 10];
            }
        });
        let a;
        fetch('../test/data/series.json').then(response => response.json()).then(function(values) {

            a = values;
            mapObj.addLayer(values)

        })
        fetch('../test/data/car_2012.json').then(response => response.json()).then(function(values) {
            values.forEach(mapObj => {
                mapObj.geoCoord = [
                    mapObj.lon.toString(),
                    mapObj.lat.toString()
                ];
            });
            // values.splice(1,16);

            const series1 = [{
                id: 3,
                cluster: {
                    enable: false, //是否开启聚合
                    distance: 50, // number 聚合点之间的距离 默认为20个单位（piex）
                    animationDuration: 700 //聚合动画时间，默认为700毫秒
                },
                // maxZoom: 10, //数据显示最大级别
                // minZoom: 6, //数据显示最小级别
                data: values,
                type: 'point',
                // symbol: 'icon:test/data/jingli-1.png',
                symbol: 'circle',
                symbolSize: [10, 20],
                symbolStyle: {
                    normal: {
                        anchor: [0.5, 0.5], //图标偏移位置。
                        // color: 'red'
                        // symbolSize: [15, 15],
                        fillColor: 'red', // 'rgb(140,0,140)',
                        strokeWitdh: 1,
                        strokeColor: 'rbg(140,0,140)'
                    },
                    emphasis: {
                        strokeWitdh: 2,
                        fillColor: 'red',

                        symbolSize: [30, 30]
                    }
                },
                labelColumn: 'name',
                labelSize: [10, 20],
                label: {
                    normal: {
                        show: false,
                        textStyle: {
                            color: '#fff',
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontFamily: 'sans-serif',
                            fontSize: '55px'
                        }
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '16px'
                        }
                    }
                },
                showPopup: false //显示气泡框
            }];

            let layer1 = mapObj.addLayer({
                id: 5,
                series: series1
            });

            layer1.on('click', function(data) {
                console.log('layer1', data);
            });
            // console.log(layer1);
            mapObj.un('click');
            // layer1.on('unClick', function(data) {

            //     // console.log('layer1uc', data);

            // });
            // layer1.on('hover', function(data) {

            //     // console.log('layer1h', data);

            // });
            // layer1.on('unHover', function(data) {

            //     // console.log('layer1uh', data);

            // });

            // layer1.un('click');
        });
        fetch('../test/data/station.json').then(response => response.json()).then(function(values) {
            values.forEach(mapObj => {
                mapObj.geoCoord = [mapObj.lon, mapObj.lat];
            });
            series.push({
                cluster: {
                    enable: false, //是否开启聚合
                    distance: 50, // number 聚合点之间的距离 默认为20个单位（piex）
                    animationDuration: 700 //聚合动画时间，默认为700毫秒
                },
                data: values, //{x,y,value}
                type: 'point', // point|line|polygon|chart|..
                symbol: 'circle', //circle|rect|icon
                symbolSize: '', //[min,max]
                symbolStyle: {
                    normal: {
                        symbolSize: [6, 6],
                        strokeWidth: 1,
                        strokeColor: 'black',
                        fillColor: 'orange'
                    },
                    emphasis: {
                        symbolSize: 7,
                        strokeWidth: 1,
                        strokeColor: '#fff',
                        fillColor: 'blue'
                    }
                },
                // maxZoom: 5,
                // minZoom: 3,
                contextmenu: true,
                showPopup: false
            });

            // let layer2 = mapObj.addLayer(
            //     series: series
            // );

            // layer2[0].on('click', function(data) {
            //     console.log('layer2:', data);
            // });
        });
        // mapObj.on('geoSelect', function(data) {

        //     console.log('getdata:', data);

        // });

        // mapObj.on('geoUnSelect', function(data) {

        //     console.log('getundata:', data);

        // });
        mapObj.on('click', function(data) {
            console.log('getdata:', data);
        });
        mapObj.on('drawClear', function(data) {
            console.log('getdata:', data);
        });
        mapObj.on('drawStart', function(data) {
            console.log('getdata:', data);
        });
        // mapObj.on('unClick', function(data) {

        //     // console.log('getundata:', data);

        // });

        mapObj.on('tooltipClick', function(event) {
            console.log('tooltip', event);
        });

        mapObj.on('contextmenu', function(e) {
            console.log(e);
            e.element.innerHTML =
                '<a onclick="javascript:alert();" id=1>sss</a><a id=1>sss</a><a id=1>sss</a><a id=1>sss</a><a id=1>sss</a><a id=1>sss</a>';
        });
        //选中
        document.getElementById('select').addEventListener('click', () => {
            mapObj.dispatchAction({
                type: 'click',
                id: 1
            });
        });
        //取消选中
        document.getElementById('unselect').addEventListener('click', () => {
            mapObj.dispatchAction({
                type: 'unClick',
                id: 1
            });
        });

        //筛选
        document.getElementById('filter').addEventListener('click', () => {
            //获取value=4468的feature
            //
            // const feature = mapObj.getFeaturesByProperty('name', '潍坊');
            const feature = mapObj.getFeatureById(1);
            console.log(feature);
            // const xy = feature[0].properties.geoCoord;
            //对feature触发click
            // mapObj.dispatchAction({
            //     type: 'click',
            //     id: feature[0].properties.id
            // });
            //  console.log(mapObj.getPixelFromCoords(xy));
            feature[0].set(
                'value',
                feature[0].get('value') + 1
            );
        });

        document.getElementById('remove').addEventListener('click', () => {
            mapObj.removeLayer(5);
            // mapObj.removeSeries(); //清空所有
            // mapObj.removeSeries('id');//清空单个
            // mapObj.removeSeries(['id','id1']);//清空多个
        });

        document.getElementById('add').addEventListener('click', () => {

            mapObj.addLayer({
                id: 5,
                series: series
            });
        });

        document.getElementById('showlayer').addEventListener('click', () => {
            mapObj.showLayer(5);
        });
        document.getElementById('hidelayer').addEventListener('click', () => {
            mapObj.hideLayer(5);
        });

        document.getElementById('hasLayer').addEventListener('click', () => {
            alert(mapObj.hasLayer(5));
        });
        document.getElementById('clear').addEventListener('click', () => {
            mapObj.clearTrackInfo(); //清空轨迹
            mapObj.clearSpatial(); //清空空间查询
        });
        document.getElementById('query').addEventListener('click', () => {
            mapObj.draw('Circle', function(data) {

                // mapObj.updateLayer(a);
                console.log(data);


                // 
                // data.selected.forEach()
            });

            setTimeout(() => {

                // mapObj.changeRadius(50000);

            }, 5000);

        });

        document.getElementById('query1').addEventListener('click', () => {
            mapObj.draw('LineString', function(data) {

                console.log(data);
                // data.geometry.setCoordinates([]);
                // data.selected[5][0][0].source.removeFeature(data.selected[5][0][0]);

            });
        });
        document.getElementById('query2').addEventListener('click', () => {
            mapObj.draw('Polygon', function(data) {
                console.log(data);
            });
        });
        document.getElementById('areaQuery').addEventListener('click', () => {
            mapObj.clearTrackInfo();
            mapObj.clearSpatial();
            //获取周边查询的结果 参数：1.中心点坐标 经纬度 2.半径 单位为米

            // console.log(features);
            //进行屏幕移动动画。
            //
            //
            var coo = [
                116.60062,
                35.45594
            ]; /*[116.98612837827636, 36.6650505841216]*/
            mapObj.flyTo(coo, {
                zoom: 9,
                callback: function() {
                    mapObj.spatialQuery(coo, 10000, queryCallback, {
                        showRadar: true, //是否显示雷达
                        // time: 2 //雷达扫描次数 1个圆周为1 默认为-1 即不会消失
                        limitDistance: 50000
                    });
                }
            });
            let queryCallback = function(features) {

                for (let key in features.selected) {
                    const feaArray = features.selected[key];
                    feaArray.forEach(fea => {
                        fea.forEach(feature => {
                            let coord = feature.get('geoCoord');
                            if (feature.get('features')) {
                                coord = feature
                                    .get('features')[0]
                                    .get('geoCoord');
                            }
                            mapObj.drawTrack(coord, coo, {
                                isCustom: true,
                                tooltipFun: function(data, obj) {
                                    const length = (data.length / 1000).toFixed(
                                        1
                                    );
                                    let str =
                                        '距离警情地:' + length + '公里' + '<br/>';
                                    str += '预计到达时间：' + data.time + '分钟';
                                    obj.innerHTML = str;
                                    return str;
                                }
                            });
                        });
                    });
                }
            };
        });

        setTimeout(() => {
            console.log(mapObj.getSeries(5));
        }, 2000)


    }

    render() {
        return (
            <div>
                <input id="select" type="button" value="选中" />
                <input id="unselect" type="button" value="取消选中" />
                <input id="filter" type="button" value="筛选" />
                <input id="remove" type="button" value="移除数据" />
                <input id="add" type="button" value="增加数据" />
                <input id="showlayer" type="button" value="显示数据" />
                <input id="hidelayer" type="button" value="隐藏数据" />
                <input id="return" type="button" value="返回" />
                <input id="areaQuery" type="button" value="周边范围查询" />
                <input id="query" type="button" value="画圆查询" />
                <input id="query1" type="button" value="画框查询" />
                <input id="query2" type="button" value="画多边形查询" />
                <input id="hasLayer" type="button" value="存在图层" />
                <input id="clear" type="button" value="清空查询结果" />
                <div id="map" />
            </div>
        );
    }
}
export default icon;