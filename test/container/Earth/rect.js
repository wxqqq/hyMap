/*
 * @Author: 1
 * @Date:   2017-01-10 10:15:25
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-07-20 15:55:23
 * @Email: zhangyujie3344521@163.com
 * @File Path: F:\work\hyMap\test\container\Earth\rect.js
 * @File Name: rect.js
 * @Descript:
 */

'use strict';
import React, {
    Component
} from 'react';
import map from '../../../src/index';

class rect extends Component {
    componentDidMount() {

        let mapObj = map.init(document.getElementById('map'));
        let options = {
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: '中国|山东省', //当前地图显示哪个地图
            roam: 'true', //地图是否开启缩放、平移功能
            center: [117.02778784888256, 36.65892145091036], //当前视角中心: [经度, 纬度]
            zoom: 11, //当前地图缩放比例
            scaleLimit: [5, 18], //滚轮缩放的边界
            itemStyle: '', //地图上每块区域的样式
            selectedMode: '', //地图区域的选中模式
            theme: { // string('dark'，'blue'，'white')|mapObjectr{mapId,key} 对应maobox中的mapid和access_token
                mapId: 'zhangyujie.a80cdc83',
                key: 'sk.eyJ1Ijoiemhhbmd5dWppZSIsImEiOiJkTEp6WDZrIn0.nY5bsQlZegBbb2uGgJ5jEA'
            }, //地图风格 //地图风格
            regions: '', //  name: '',特殊区域的样式
            label: '', //文本标签样式
            series: []
        };

        fetch('../test/data/poi.json').then(response => response.json()).then(function(obj) {

            let values = obj.features;
            let arr = [];
            let arr1 = [];
            let arr2 = [];
            let arr3 = [];
            values.forEach(va => {
                var data = {
                    id: new Date().getTime(),
                    geoCoord: [va.geometry.x, va.geometry.y],
                    type: va.attributes.type,
                    value: va.attributes.FID
                };
                // arr.push(data)
                let type = va.attributes.type;
                if (type == 1) {

                    arr.push(data);

                } else if (type == 2) {

                    arr.push(data);

                } else if (type == 3) {

                    arr.push(data);
                }
                // } else {

                //     arr3.push(data);
                // }
            })
            console.log(arr);

            // options.series.push({
            //     data: arr, //{x,y,value}
            //     type: 'heatmap', // tile|line|polygon|chart|..
            //     symbol: 'circle', //circle|react|icon
            //     symbolSize: '', //[min,max]
            //     symbolStyle: {
            //         'normal': {
            //             symbolSize: 1,
            //             strokeWidth: 1,
            //             strokeColor: '#ea1728',
            //             fillColor: '#ea1728'
            //         },
            //         'emphasis': {
            //             symbolSize: 1,
            //             strokeWidth: 1,
            //             strokeColor: 'blue',
            //             fillColor: 'white'
            //         }
            //     },
            //     showPopup: false

            // });
            // options.series.push({
            //     data: arr1, //{x,y,value}
            //     type: 'heatmap', // tile|line|polygon|chart|..
            //     symbol: 'circle', //circle|react|icon
            //     symbolSize: '', //[min,max]
            //     symbolStyle: {
            //         'normal': {
            //             symbolSize: 1,
            //             strokeWidth: 1,
            //             strokeColor: '#166d6e',
            //             fillColor: 'orange'
            //         },
            //         'emphasis': {
            //             symbolSize: 1,
            //             strokeWidth: 1,
            //             strokeColor: 'blue',
            //             fillColor: 'white'
            //         }
            //     },
            //     showPopup: false

            // });
            // options.series.push({
            //     data: arr2, //{x,y,value}
            //     type: 'heatmap', // tile|line|polygon|chart|..
            //     symbol: 'circle', //circle|react|icon
            //     symbolSize: '', //[min,max]
            //     symbolStyle: {
            //         'normal': {
            //             symbolSize: 1,
            //             strokeWidth: 1,
            //             strokeColor: '#ebc98d',
            //             fillColor: '#ebc98d'
            //         },
            //         'emphasis': {
            //             symbolSize: 1,
            //             strokeWidth: 1,
            //             strokeColor: 'blue',
            //             fillColor: 'white'
            //         }
            //     },
            //     showPopup: false

            // });
            options.series.push({
                data: arr, //{x,y,value}
                type: 'heatmap', // tile|line|polygon|chart|..
                heatOption: { //type为heatmap时该参数生效。
                    //     gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'], //array<string>|undefined 颜色数组 该值为默认
                    blur: 5, //number|undefined 模糊 单位：像素 默认15
                    radius: 2, //number|undefined 半径 单位：像素 默认8
                    //     shadow: 100 //number|undef 阴影大小 单位：像素 默认250
                },
                symbol: 'circle', //circle|react|icon
                symbolSize: '', //[min,max]
                symbolStyle: {
                    'normal': {
                        symbolSize: 1,
                        strokeWidth: 1,
                        strokeColor: '#24f2db',
                        fillColor: '#24f2db'
                    },
                    'emphasis': {
                        symbolSize: 1,
                        strokeWidth: 1,
                        strokeColor: 'blue',
                        fillColor: 'white'
                    }
                },
                showPopup: false

            });

            mapObj.setOption(options);

        })
        fetch('../test/data/station.json').then(response => response.json()).then(function(values) {
            values.forEach(obj => {

                obj.geoCoord = [obj.lon, obj.lat];

            });
            // options.series.push({
            //     data: values, //{x,y,value}
            //     type: 'tile', // tile|line|polygon|chart|..
            //     symbol: 'rect', //circle|react|icon
            //     symbolSize: '', //[min,max]
            //     symbolStyle: {
            //         'normal': {
            //             symbolSize: 2,
            //             strokeWidth: 1,
            //             strokeColor: 'red',
            //             fillColor: 'orange'
            //         },
            //         'emphasis': {
            //             symbolSize: 1,
            //             strokeWidth: 1,
            //             strokeColor: 'blue',
            //             fillColor: 'white'
            //         }
            //     },
            //     showPopup: false

            // });

            // mapObj.setOption(options);

        });

        mapObj.on('geoSelect', function(data) {

            console.log('getdata:', data);

        });
        // obj.off('geoSelect', function(data) {

        //     console.log('getdata:', data);

        // });

        mapObj.on('geoUnSelect', function(data) {

            console.log('getundata:', data);

        });

    }
    render() {

        return (<div id = 'map'> </div>);

    }
}
export default rect;