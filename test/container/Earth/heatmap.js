/*
 * @Author: wxq
 * @Date:   2017-03-16 13:33:33
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-04-14 14:16:51
 * @Email: 304861063@qq.com
 * @File Path: H:\work\hyMap\test\container\Earth\heatmap.js
 * @File Name: heatmap.js
 * @Descript: 
 */

'use strict';
import React, {
    Component
} from 'react';
import map from '../../../src/index';

class heatmap extends Component {
    componentDidMount() {

        let obj = map.init(document.getElementById('map'));
        let options = {
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: '中国', //当前地图显示哪个地图
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            zoom: 7, //当前地图缩放比例
            scaleLimit: [5, 12], //滚轮缩放的边界
            selectedMode: '', //地图区域的选中模式
            theme: 'dark', //地图风格
            regions: '', //  name: '',特殊区域的样式
            label: '', //文本标签样式
            series: []
        };

        fetch('../test/data/station.json').then(response => response.json()).then(function(values) {

            values.forEach(obj => {

                obj.geoCoord = [Number(obj.lon), Number(obj.lat)];

            });
            options.series.push({
                data: values, //{x,y,value}
                type: 'heatmap', // point|line|polygon|chart|heatmap..
                // heatOption: { //type为heatmap时该参数生效。
                //     gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'], //array<string>|undefined 颜色数组 该值为默认
                //     blur: 15, //number|undefined 模糊 单位：像素 默认15
                //     radius: 8, //number|undefined 半径 单位：像素 默认8
                //     shadow: 100 //number|undef 阴影大小 单位：像素 默认250
                // },
                symbolSize: [5, 5], //[min,max]
                symbolStyle: { //type为heatmap时，normal样式不生效，emphasis依然有效果
                    'normal': {
                        strokeWidth: 1,
                        strokeColor: 'blue',
                        fillColor: 'orange'
                    },
                    'emphasis': {
                        symbolSize: 3
                    }
                },
                label: { //type为heatmap时，normal样式不生效，emphasis依然有效果
                    'normal': {
                        show: false,
                        textStyle: {
                            color: 'red'
                        }
                    }
                },
                showPopup: false

            });
            obj.setOption(options);

        });

        obj.on('click', function(data) {

            console.log('getdata:', data);

        });
        // obj.off('geoSelect', function(data) {

        //     console.log('getdata:', data);

        // });

        obj.on('unClick', function(data) {

            console.log('getundata:', data);

        });

    }
    render() {

        return (<div id = 'map' > </div>);

    }
}
export default heatmap;