/*
 * @Author: wxq
 * @Date:   2017-07-26 11:31:30
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-08-31 19:04:54
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\test\container\Earth\region.js
 * @File Name: region.js
 * @Descript: 
 */
'use strict';
import 'antd/dist/antd.css';
import React, {
    Component
} from 'react';
import map from '../../../src/index';
import {Row, Col} from 'antd';

class region extends Component {
    constructor(props) {

        super(props);

        this.state = {
            date: '',
            showLayer: false,
            mapObj: {},
            options: {}
        };

    }

    componentDidMount() {

        this.mapObj = map.init(document.getElementById('map'));

        this.setState({
            mapObj: this.mapObj
        });

        let options = {
            serverUrl: 'http://192.168.1.50:8080/geoserver',
            show: true, //地图的显示状态 true为显示 false 为不显示
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            theme: 'gaode', //地图风格
            // center: [113.2759952545166, 23.117055306224895], //当前视角中心: [经度, 纬度]
            zoom: 5, //当前地图缩放比例
            scaleLimit: [2, 12], //滚轮缩放的边界
            // theme: { // string('dark'，'blue'，'white')|mapObjectr{mapId,key} 对应maobox中的mapid和access_token
            // mapId: 'zhangyujie.a80cdc83',
            // key: 'sk.eyJ1Ijoiemhhbmd5dWppZSIsImEiOiJkTEp6WDZrIn0.nY5bsQlZegBbb2uGgJ5jEA'
            // }, //地图风格
            series: []
        };

        this.setState({
            options: options
        });

        this.mapObj.setOption(options);

        let regionOptions = {
            type: 'region',
            location: '中国', //当前地图显示哪个地图
            drillDown: false, //是否开启区域点击下钻功能。
            label: {
                normal: {
                    show: false,
                    textStyle: {
                        color: '#fff',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                        fontSize: '16px'
                    }
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                        fontSize: '16px'
                    }
                }
            },
            itemStyle: {
                normal: {
                    strokeWidth: 2, //边框宽度
                    strokeColor: 'green', //边框颜色
                    fillColor: 'rgba(255,255,255,0.2)'
                },
                emphasis: {
                    strokeWidth: 1, //边框宽度
                    fillColor: 'rgba(255,255,255,0.5)'
                }
            }, //地图上每块区域的样式
            filter: [{
                name: '山东省',
                itemStyle: {
                    normal: {
                        strokeWidth: 0, //边框宽度
                        strokeColor: 'blue', //边框颜色
                        fillColor: '#006cff'
                    },
                    emphasis: {
                        strokeWidth: 1, //边框宽度
                        strokeColor: '#B5FF91', //边框颜色
                        fillColor: 'blue'
                    }
                },
                label: {
                    normal: {
                        show: false,
                        textStyle: {
                            color: 'red'
                        }
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            color: '#B5FF91',
                            fontStyle: 'italic',
                            fontWeight: 'bold',
                            fontFamily: 'sans-serif',
                            fontSize: '16px'
                        }
                    }
                }
            }, {
                name: '北京市',
                itemStyle: {
                    normal: {
                        strokeWidth: 0, //边框宽度
                        strokeColor: 'blue', //边框颜色
                        fillColor: '#f42929'
                    },
                    emphasis: {
                        strokeWidth: 1, //边框宽度
                        strokeColor: '#B5FF91', //边框颜色
                        fillColor: 'blue'
                    }
                },
                label: {
                    normal: {
                        show: false,
                        textStyle: {
                            color: 'red'
                        }
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            color: '#B5FF91',
                            fontStyle: 'italic',
                            fontWeight: 'bold',
                            fontFamily: 'sans-serif',
                            fontSize: '16px'
                        }
                    }
                }
            }], //  name: '',特殊区域的样式
            selectedMode: '' //地图区域的选中模式 single mulit
        };

        this.mapObj.addLayer([regionOptions]);

        // //选中
        // document.getElementById('changesd').addEventListener('click', () => {

        //     this.mapObj.setGeo({
        //         map: '中国|山东省',
        //         center: [117, 36.20],
        //         zoom: 7
        //     });

        // });

        // document.getElementById('return').addEventListener('click', () => {

        //     this.mapObj.geoGoBack();

        // });

        this.mapObj.on('geoSelect', function (data) {

            console.log('getdata:', data);

        });

        this.mapObj.on('geoUnSelect', function (data) {

            console.log('getundata:', data);

        });

    }

    render() {

        return (
            <Row>
                <Col span={23}>
                    <div id='map'/>
                </Col>
            </Row>
        );

    }
}

export default region;