/*
 * @Author: 1
 * @Date:   2017-01-10 10:15:25
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-04-14 14:17:03
 * @Email: zhangyujie3344521@163.com
 * @File Path: H:\work\hyMap\test\container\Earth\chart.js
 * @File Name: chart.js
 * @Descript:
 */

'use strict';
import React, {
    Component
} from 'react';
import map from '../../../src/index';

class chart extends Component {
    componentDidMount() {

        let obj = map.init(document.getElementById('map'));
        let options = {
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: '中国|山东省', //当前地图显示哪个地图
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            zoom: 7, //当前地图缩放比例
            scaleLimit: [5, 12], //滚轮缩放的边界
            itemStyle: '', //地图上每块区域的样式
            selectedMode: '', //地图区域的选中模式
            theme: 'dark', //地图风格
            regions: '', //  name: '',特殊区域的样式
            label: '', //文本标签样式
            series: []
        };

        fetch('../test/data/car_2012.json').then(response => response.json()).then(function(values) {

            values.forEach(obj => {

                let div = document.createElement('div');
                div.innerHTML = '<div style="background-color:#ccc">' + obj.name + '</div>';
                obj.container = div;
                obj.geoCoord = [obj.lon, obj.lat];

            });

            options.series.push({
                data: values, //{x,y,value}
                type: 'chart', // point|line|polygon|chart|..
                symbol: 'circle', //circle|react|icon
                symbolSize: '', //[min,max]
                symbolStyle: {
                    'normal': {
                        radius: 5,
                        strokeWidth: 1,
                        strokeColor: 'black',
                        fillColor: 'orange'
                    },
                    'hover': {
                        radius: 10,
                        strokeWidth: 1,
                        strokeColor: 'red',
                        fillColor: 'pink'
                    },
                    'emphasis': {
                        radius: 15,
                        strokeWidth: 3,
                        strokeColor: 'blue',
                        fillColor: 'white'
                    }
                },
                label: 'mc',
                showPopup: false

            });

            obj.setOption(options);

        });

        obj.on('geoSelect', function(data) {

            console.log('getdata:', data);

        });
        // obj.off('geoSelect', function(data) {

        //     console.log('getdata:', data);

        // });

        obj.on('geoUnSelect', function(data) {

            console.log('getundata:', data);

        });

    }
    render() {

        return (<div id = 'map' > </div>);

    }
}
export default chart;