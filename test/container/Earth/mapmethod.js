/*
 * @Author: 1
 * @Date:   2017-01-10 10:15:25
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-08-03 15:47:08
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
    Button,
    Switch,
    Icon,
    Radio,
    Row,
    Col
} from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


import Editor from '../App/editor';

class mapmethod extends Component {
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

        map.ON_WEBGL = false;
        this.mapObj = map.init(document.getElementById('map'))
        this.setState({
            mapObj: this.mapObj
        });

        let options = {

            serverUrl: 'http://192.168.1.50:8080/geoserver',
            show: true, //地图的显示状态 true为显示 false 为不显示
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            theme: 'tianditu', //地图风格
            // center: [113.2759952545166, 23.117055306224895], //当前视角中心: [经度, 纬度]
            zoom: 5, //当前地图缩放比例
            scaleLimit: [2, 12], //滚轮缩放的边界
            // theme: { // string('dark'，'blue'，'white')|mapObjectr{mapId,key} 对应maobox中的mapid和access_token
            // mapId: 'zhangyujie.a80cdc83',
            // key: 'sk.eyJ1Ijoiemhhbmd5dWppZSIsImEiOiJkTEp6WDZrIn0.nY5bsQlZegBbb2uGgJ5jEA'
            // }, //地图风格/地图风格
            series: []
        };

        this.setState({
            options: options
        });

        this.mapObj.setOption(options);

        document.getElementById('loadLayer').addEventListener('click', () => {


        });
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
        }
        console.log(`switch to ${checked}`, type);
    }

    onChangeTheme = (e) => {

        this.mapObj.setTheme(e.target.value);
    }

    onChangeLayer = (checked) => {
        console.log(this.state)

        if (checked) {
            this.setState({
                showLayer: true
            });
            this.mapObj.showLayer(1)
        } else {
            this.setState({
                showLayer: false
            });
            this.mapObj.hideLayer(1)
        }


    }

    render() {
        // <Col span={8}><Editor mapObj={this.state.mapObj} options={this.state.options}/></Col>
        return (
            <Row>
                  
                    <Col span={23}>
                        <div>
                           
                             主题：<RadioGroup onChange={this.onChangeTheme} defaultValue='dark'>
                                <RadioButton value='dark'>黑色</RadioButton>
                                <RadioButton value='white'>白色</RadioButton>
                                <RadioButton value='blue'>蓝色</RadioButton>
                              </RadioGroup>   
                            </div>
                            <br/>
                            <div>
                            显示：<label>地图：</label><Switch defaultChecked={true} onChange={(checked)=> this.onChange(checked,'map')} checkedChildren={'开'} unCheckedChildren={'关'} />
                            <label>底图：</label><Switch defaultChecked={true}onChange={(checked)=> this.onChange(checked,'base')} checkedChildren={'开'} unCheckedChildren={'关'} />
                 
                            </div>
                            <div>
                            动画：
                                <input id='fly' type='button' value='飞到济南'/>
                                <input id='flychina' type='button' value='返回全国' />
                                </div>
                                <div>
                                测量：
                                 <input className='theme' id='distance' type='button' value='测距离'/>
                                <input className='theme' id='area' type='button' value='测面积'/>
                                 <input id='loadLayer' type='button' value='加载图层'/>
                            </div>
                             <br/>
                            <div id = 'map' ></div>
                    </Col>
                </Row>
        );

    }
}
export default mapmethod;