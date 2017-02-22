/*
 * @Author: 1
 * @Date:   2017-01-10 10:15:25
 * @Last Modified by:   hydata
 * @Last Modified time: 2017-01-12 10:12:21
 * @Email: zhangyujie3344521@163.com
 * @File Path: /Users/zhangyujie/GitHub/FEscaffold/index.js
 * @File Name: index.js
 * @Descript:
 */

'use strict';
import React, {
    Component
} from 'react';
import map from '../../../src/index';

class mapmethod extends Component {
    componentDidMount() {

        let obj = map.init(document.getElementById('map'));
        let options = {
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: 'xzqh', //当前地图显示哪个地图
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            zoom: 7, //当前地图缩放比例
            scaleLimit: [5, 12], //滚轮缩放的边界
            itemStyle: {
                'normal': {
                    strokeWidth: 1, //边框宽度
                    strokeColor: '#ffffff', //边框颜色
                    fillColor: 'green',
                },
                'emphasis': {
                    strokeWidth: 2, //边框宽度
                    strokeColor: 'yellow', //边框颜色
                    fillColor: 'orange',
                }
            }, //地图上每块区域的样式
            regions: [{
                name: '济南市',
                itemStyle: {
                    'normal': {
                        strokeWidth: 1, //边框宽度
                        strokeColor: 'blue', //边框颜色
                        fillColor: 'pink',
                    },
                    'emphasis': {
                        strokeWidth: 1, //边框宽度
                        strokeColor: '#B5FF91', //边框颜色
                        fillColor: 'red',
                    }
                }
            }, {
                name: '潍坊市',
                itemStyle: {
                    'normal': {
                        strokeWidth: 1, //边框宽度
                        strokeColor: '#ccc', //边框颜色
                        fillColor: 'pink',
                    },
                    'emphasis': {
                        strokeWidth: 2, //边框宽度
                        strokeColor: '#B5FF91' //边框颜色
                    }
                }
            }], //  name: '',特殊区域的样式
            selectedMode: '', //地图区域的选中模式 single mulit
            theme: 'dark', //地图风格
            label: '', //文本标签样式
            series: []
        };
        obj.setOption(options);
        document.getElementById('hide').addEventListener('click', () => {

            obj.hide();

        });
        //选中
        document.getElementById('show').addEventListener('click', () => {

            obj.show();

        });
        //重庆
        document.getElementById('fly').addEventListener('click', () => {

            obj.flyto({
                xy: [116.98514, 36.66443],
                zoom: 12
            });

        });
        //选中
        document.getElementById('flychina').addEventListener('click', () => {

            obj.flyto({
                xy: [117, 36.20],
                zoom: 4
            });

        });

    }
    render() {

        return (<div>
                    <input id='hide' type='button' value='隐藏地图'/>
                    <input id='show' type='button' value='显示地图' />
                    <input id='fly' type='button' value='飞到济南'/>
                    <input id='flychina' type='button' value='返回全国' />
                    <div id = 'map' ></div>
            </div>);

    }
}
export default mapmethod;