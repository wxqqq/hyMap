/*
 * @Author: wxq
 * @Date:   2017-04-14 10:39:57
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-05-24 15:49:47
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\test\container\Earth\labelAnimate.js
 * @File Name: labelAnimate.js
 * @Descript: 
 */
'use strict';
import React, {
    Component
} from 'react';
import map from '../../../src/index';

class labelAnimate extends Component {
    componentDidMount() {

        let obj = map.init(document.getElementById('map'));
        let options = {
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: '', //mapName  格式：undefined|(string|string|string) 为空不加载地图边界信息，否则按传入参数最后一个为当前级别进行数据加载。
            //目前测试数据包括3级，中国各个省，山东省，济南市的区域数据。
            drillDown: true, //是否开启区域点击下钻功能。
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            zoom: 7, //当前地图缩放比例
            scaleLimit: [3, 20], //滚轮缩放的边界
            itemStyle: '', //地图上每块区域的样式
            selectedMode: '', //地图区域的选中模式
            theme: 'dark', //地图风格
            regions: '', //  name: '',特殊区域的样式
            label: '', //文本标签样式
            series: []
        };
        let series = [];
        fetch('../test/data/car_2012.json').then(response => response.json()).then(function(values) {

            values.forEach(obj => {

                obj.geoCoord = [obj.lon, obj.lat];

            });

            series.push({
                id: 3,
                cluster: {
                    enable: false, //是否开启聚合
                    distance: 50, // number 聚合点之间的距离 默认为20个单位（piex）
                    animationDuration: 700 //聚合动画时间，默认为700毫秒
                },
                // maxZoom: 10, //数据显示最大级别
                // minZoom: 6, //数据显示最小级别
                data: values,
                // type: 'point',
                // symbol: 'icon:test/data/test.png',
                // symbolSize: [10, 20],
                symbolStyle: {
                    'normal': {
                        // symbolSize: [15, 15],
                        // fillColor: 'rgb(140,0,140)',
                        // strokeWitdh: 1,
                        // strokeColor: 'rbg(140,0,140)'
                    },
                    'emphasis': {
                        // strokeWitdh: 2,
                        // symbolSize: [20, 30],
                    }
                },
                /******************新增属性**************************** */
                labelColumn: 'value', //显示的字段名称
                labelAnimate: {
                    enable: 'true', //是否开启动画
                    period: 1 //动画时间 单位 秒

                },

                labelSize: [15, 40], //单位 pt
                /*******************新增属性*************************** */
                label: {
                    'normal': {
                        show: true,
                        textStyle: {
                            color: 'red',
                            textAlign: 'center', //文字对齐方式：'left', 'right', 'center', 'end' or 'start'
                            offsetX: 0, //x轴偏移
                            offsetY: 15, //y轴偏移
                            // rotation: 0, //旋转角度 360 顺时针 number
                            // fontStyle: 'normal',
                            // fontWeight: 'bold',
                            // fontFamily: 'sans-serif',
                            // fontSize: '30pt'
                        }
                    },
                    'emphasis': {
                        show: true,
                        textStyle: {
                            color: 'green',
                        }

                    }
                },
                showPopup: false //显示气泡框
            });
            obj.setOption(options);
            obj.addLayer({
                id: 113,
                series
            });

            obj.setTooltip({
                show: false,
                trigger: ['item'], // item、map  ['item', 'geo']
                triggeron: 'click', //'click', // click, mouseover, mousemove, dblclick , ['click'],
                enterable: true, //true 鼠标是否可进入浮出泡泡框中
                style: {
                    'border-color': '#cc0',
                    'border-radius': '5',
                    'border-width': '2',
                    'border-style': 'solid',
                    'width': '80',
                    'height': '30'
                },
                formatter: function(param) { //div内的内容

                    return param.dataIndex + ': ' + param.value;

                },
                position: function() { //相对于当前事件点的位置

                    return [0, 0];
                    // return [20, 10];

                }
            });

        });
        obj.on('geoSelect', function(data) {

            console.log('getdata:', data);


        });

        obj.on('geoUnSelect', function(data) {

            console.log('getundata:', data);


        });
        obj.on('click', function(data) {

            console.log('getdata:', data);

        });

        obj.on('unClick', function(data) {

            console.log('getundata:', data);


        });

        let value = 555;
        let y = 36.69190;
        let size = 11;
        //筛选
        document.getElementById('update').addEventListener('click', () => {

            value++;

            // y++;
            size++;
            series[0].data[0].value++;
            series[0].data[1].value++;
            // series[0].data = [{
            //     "name": "潍坊",
            //     "id": 1,
            //     "lat": 36.69190,
            //     "geoCoord": [119.17692, y],
            //     "car": 4301821,
            //     "driver": 3484586,
            //     "value": value
            // }];

            // series[0].symbolSize = [size, 30];
            // series.symbolStyle = {
            //     'normal': {
            //         // symbolSize: [15, 15],
            //         fillColor: 'rgb(140,0,140)',
            //         strokeWitdh: 1,
            //         strokeColor: 'rbg(140,0,140)'
            //     },
            //     'emphasis': {
            //         strokeWitdh: 2
            //     }
            // };

            // series[0].label = {
            //     'normal': {
            //         show: true,
            //         textStyle: {
            //             color: 'blue',
            //             textAlign: 'center', //文字对齐方式：'left', 'right', 'center', 'end' or 'start'
            //             offsetX: 0, //x轴偏移
            //             offsetY: 15, //y轴偏移
            //             // rotation: 0, //旋转角度 360 顺时针 number
            //             // fontStyle: 'normal',
            //             // fontWeight: 'bold',
            //             // fontFamily: 'sans-serif',
            //             fontSize: '30pt'
            //         }
            //     },
            //     'emphasis': {
            //         show: true,
            //         textStyle: {}

            //     }
            // };

            /*  series = [{

                  id: 31,
                  cluster: {
                      enable: false, //是否开启聚合
                      distance: 50, // number 聚合点之间的距离 默认为20个单位（piex）
                      animationDuration: 700 //聚合动画时间，默认为700毫秒
                  },
                  // maxZoom: 10, //数据显示最大级别
                  // minZoom: 6, //数据显示最小级别
                  data: [{
                      "name": "潍坊",
                      "id": 1,
                      "lat": 37.69190,
                      "geoCoord": [119.17692, 36.69190],
                      "car": 4301821,
                      "driver": 3484586,
                      "value": value++
                  }],
                  type: 'heatmap',
                  // symbol: 'icon:test/data/jingli-1.png',
                  symbolSize: [0, 0],
                  // symbolStyle: {
                  //     'normal': {
                  //         // symbolSize: [15, 15],
                  //         fillColor: 'rgb(140,0,140)',
                  //         strokeWitdh: 1,
                  //         strokeColor: 'rbg(140,0,140)'
                  //     },
                  //     'emphasis': {
                  //         strokeWitdh: 2
                  //     }
                  // },
                  *****************新增属性**************************** 
                  labelColumn: 'value', //显示的字段名称
                  labelAnimate: {
                      enable: 'true', //是否开启动画
                      period: 1 //动画时间 单位 秒

                  },

                  labelSize: [12, 40], //单位 pt
                  /*******************新增属性*************************** 
            /*            label: {
                            'normal': {
                                show: true,
                                textStyle: {
                                    color: 'blue',
                                    textAlign: 'center', //文字对齐方式：'left', 'right', 'center', 'end' or 'start'
                                    offsetX: 0, //x轴偏移
                                    offsetY: 15, //y轴偏移
                                    // rotation: 0, //旋转角度 360 顺时针 number
                                    // fontStyle: 'normal',
                                    // fontWeight: 'bold',
                                    // fontFamily: 'sans-serif',
                                    fontSize: '30pt'
                                }
                            },
                            'emphasis': {
                                show: true,
                                textStyle: {}

                            }
                        },
                        showPopup: false //显示气泡框

                    }];*/
            obj.updateLayer({
                id: 113,
                series
            });


            // window.setTimeout(function() {

            //     value++;
            //     series[0].data[2].value++;
            //     obj.updateLayer({
            //         id: 113,
            //         series
            //     });
            // }, 100);

        });
        document.getElementById('add').addEventListener('click', () => {

            value++;

            series[0].data[0].value++;
            series[0].data[0].geoCoord = [119.17692, 37.69190];

            // series[0].data[1].value++;
            const s1 = {
                id: 31,
                cluster: {
                    enable: false, //是否开启聚合
                    distance: 50, // number 聚合点之间的距离 默认为20个单位（piex）
                    animationDuration: 700 //聚合动画时间，默认为700毫秒
                },
                // maxZoom: 10, //数据显示最大级别
                // minZoom: 6, //数据显示最小级别
                data: [{
                    "name": "潍坊",
                    "id": 1,
                    "lat": 37.69190,
                    "geoCoord": [119.17692, 36.69190],
                    "car": 4301821,
                    "driver": 3484586,
                    "value": value++
                }],
                type: 'point',
                symbol: 'icon:test/data/jingli-1.png',
                symbolSize: [0, 0],
                symbolStyle: {
                    'normal': {
                        symbolSize: [15, 15],
                        fillColor: 'rgb(140,0,140)',
                        strokeWitdh: 1,
                        strokeColor: 'rbg(140,0,140)'
                    },
                    'emphasis': {
                        strokeWitdh: 2
                    }
                },
                /******************新增属性**************************** */
                labelColumn: 'value', //显示的字段名称
                labelAnimate: {
                    enable: 'true', //是否开启动画
                    period: 1 //动画时间 单位 秒

                },

                labelSize: [12, 40], //单位 pt
                /*******************新增属性*************************** */
                label: {
                    'normal': {
                        show: true,
                        textStyle: {
                            color: 'red',
                            textAlign: 'center', //文字对齐方式：'left', 'right', 'center', 'end' or 'start'
                            offsetX: 0, //x轴偏移
                            offsetY: 15, //y轴偏移
                            // rotation: 0, //旋转角度 360 顺时针 number
                            // fontStyle: 'normal',
                            // fontWeight: 'bold',
                            // fontFamily: 'sans-serif',
                            fontSize: '30pt'
                        }
                    },
                    'emphasis': {
                        show: true,
                        textStyle: {}

                    }
                },
                showPopup: false //显示气泡框
            };
            series.push(s1);
            obj.updateLayer({
                id: 113,
                series
            });

        });



    }

    render() {

        return (<div>
              <input id='update' type='button' value='整体更新数据' />
               <input id='add' type='button' value='增加' />
            <div id = 'map' /> 
            </div>);

    }
}
export default labelAnimate;