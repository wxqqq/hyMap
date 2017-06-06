/*
 * @Author: 1
 * @Date:   2017-01-10 10:15:25
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-05 09:59:20
 * @Email: zhangyujie3344521@163.com
 * @File Path: F:\work\hyMap\test\container\Earth\mapmethod.js
 * @File Name: mapmethod.js
 * @Descript:
 */

'use strict';
import 'antd/dist/antd.css';
import React, {
    Component
} from 'react';
import map from '../../../src/index';
import {
    Switch,
    Icon,
    Radio
} from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class mapmethod extends Component {
    constructor(props) {

        super(props);
        this.state = {
            date: '',
        };

    }
    componentDidMount() {

        this.mapObj = map.init(document.getElementById('map'));
        let options = {
            serverUrl: 'http://192.168.1.50:8080/geoserver',
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: '中国', //当前地图显示哪个地图
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            zoom: 7, //当前地图缩放比例
            scaleLimit: [2, 12], //滚轮缩放的边界
            label: {
                'normal': {
                    show: false,
                    textStyle: {
                        color: '#fff',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                        fontSize: '16px'
                    }
                },
                'emphasis': {
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
                'normal': {
                    strokeWidth: 2, //边框宽度
                    strokeColor: 'green', //边框颜色
                    fillColor: 'rgba(255,255,255,0.2)'
                },
                'emphasis': {
                    strokeWidth: 1, //边框宽度
                    fillColor: 'rgba(255,255,255,0.5)'
                }
            }, //地图上每块区域的样式
            regions: [{
                name: '山东省',
                itemStyle: {
                    'normal': {
                        strokeWidth: 1, //边框宽度
                        strokeColor: 'blue', //边框颜色
                        fillColor: '#2a333d'
                    },
                    'emphasis': {
                        strokeWidth: 1, //边框宽度
                        strokeColor: '#B5FF91', //边框颜色
                        fillColor: 'blue'
                    }
                },
                label: {
                    'normal': {
                        show: false,
                        textStyle: {
                            color: 'red'
                        }
                    },
                    'emphasis': {
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
            selectedMode: '', //地图区域的选中模式 single mulit
            theme: { // string('dark'，'blue'，'white')|mapObjectr{mapId,key} 对应maobox中的mapid和access_token
                mapId: 'zhangyujie.a80cdc83',
                key: 'sk.eyJ1Ijoiemhhbmd5dWppZSIsImEiOiJkTEp6WDZrIn0.nY5bsQlZegBbb2uGgJ5jEA'
            }, //地图风格
            series: []
        };
        this.mapObj.setOption(options);

        // 重庆
        document.getElementById('fly').addEventListener('click', () => {

            this.mapObj.flyTo(
                [116.98514, 36.66443], {
                    zoom: 10
                });

        });
        //选中
        document.getElementById('flychina').addEventListener('click', () => {

            this.mapObj.flyTo(
                [117, 36.20], {
                    zoom: 5
                });

        });
        //选中
        document.getElementById('changecq').addEventListener('click', () => {

            this.mapObj.setGeo({
                map: '中国|重庆市',
                center: [107.98613, 29.653439],
                zoom: 8,
                itemStyle: {
                    'normal': {
                        strokeWidth: 1, //边框宽度
                        strokeColor: '#111', //边框颜色
                        fillColor: '#323c48'
                    }
                }
            });


        });
        //选中
        document.getElementById('changesd').addEventListener('click', () => {

            this.mapObj.setGeo({
                map: '中国|山东省',
                center: [117, 36.20],
                zoom: 7
            });

        });

        document.getElementById('return').addEventListener('click', () => {

            this.mapObj.geoGoBack();

        });
        document.getElementById('distance').addEventListener('click', () => {

            this.mapObj.measure('distance');

        });
        document.getElementById('area').addEventListener('click', () => {

            this.mapObj.measure('area');

        });


        this.mapObj.on('geoSelect', function(data) {

            console.log('getdata:', data);

        });

        this.mapObj.on('geoUnSelect', function(data) {

            console.log('getundata:', data);

        });



    }

    onChange(checked, type) {
        switch (type) {
            case 'map':

                if (checked) {

                    this.mapObj.show();

                } else {

                    this.mapObj.hide();

                }
                break;
            case 'base':

                if (checked) {

                    this.mapObj.showBaseMap();

                } else {

                    this.mapObj.hideBaseMap();

                }
                break;
            case 'geo':
                if (checked) {

                    this.mapObj.showGeo();

                } else {

                    this.mapObj.hideGeo();

                }
                break;
        }
        console.log(`switch to ${checked}`, type);
    }
    onChangeTheme = (e) => {
        console.log(e)
        this.mapObj.setTheme(e.target.value);
    }
    render() {

        return (<div>
               <div>
                 主题： <RadioGroup onChange={this.onChangeTheme} defaultValue='dark'>
                    <RadioButton value='dark'>黑色</RadioButton>
                    <RadioButton value='white'>白色</RadioButton>
                    <RadioButton value='blue'>蓝色</RadioButton>
                  </RadioGroup>   
                </div>
                <br/>
                <div>
                显示：<label>地图：</label><Switch defaultChecked={true} onChange={(checked)=> this.onChange(checked,'map')} checkedChildren={'开'} unCheckedChildren={'关'} />
                <label>底图：</label><Switch defaultChecked={true}onChange={(checked)=> this.onChange(checked,'base')} checkedChildren={'开'} unCheckedChildren={'关'} />
                <label>边界：</label><Switch defaultChecked={true} onChange={(checked)=> this.onChange(checked,'geo')} checkedChildren={'开'} unCheckedChildren={'关'} />
     
                </div>
                <div>
                动画：
                    <input id='fly' type='button' value='飞到济南'/>
                    <input id='flychina' type='button' value='返回全国' />
                    <input id='changecq' type='button' value='修改区域（重庆）'/>
                    <input id='changesd' type='button' value='修改区域（山东）'/>
                    <input id='return' type='button' value='返回'/>
                    </div>
                    <div>
                    测量：
                     <input className='theme' id='distance' type='button' value='测距离'/>
                    <input className='theme' id='area' type='button' value='测面积'/>
                    </div>
                    <div id = 'map' ></div>
            </div>);

    }
}
export default mapmethod;