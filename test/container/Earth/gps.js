/*
 * @Author: 1
 * @Date:   2017-01-10 10:15:25
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-05-03 18:51:26
 * @Email: zhangyujie3344521@163.com
 * @File Path: H:\work\hyMap\test\container\Earth\gps.js
 * @File Name: gps.js
 * @Descript:
 */

'use strict';
import React, {
    Component
} from 'react';
import map from '../../../src/index';

class gps extends Component {
    componentDidMount() {

        let obj = map.init(document.getElementById('map'));
        let options = {
            serverUrl: 'http://192.168.1.50:8080/geoserver', //服务器地址
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: '', //'中国|山东省', //当前地图显示哪个地图
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

        options.series.push({
            data: [{
                driver: 3484586,
                geoCoord: "119.17692,36.6919",
                id: 1,
                lat: 36.6919,
                lon: 119.17692,
                name: "潍坊",
                value: 4468
            }], //{x,y,value}
            type: 'point', // point|line|polygon|chart|heatmap..
            symbol: 'circle', //circle|rect|icon
            symbolSize: 10, //[min,max]
            symbolStyle: {
                'normal': {
                    strokeWidth: 0,
                    strokeColor: 'red',
                    fillColor: 'orange'
                },
                'emphasis': {
                    strokeWidth: 1,
                    // strokeColor: 'green',
                    fillColor: 'rgb(133,122,55)'
                }
            },
            label: {
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
        obj.initgpslayer();

        obj.updateGps([{
            geoCoord: "119.17692,36.6919",
            id: 1,
            lat: 36.6919,
            lon: 119.17692,
            name: "潍坊",
            value: 4468
        }])

        window.setTimeout(() => {
            console.log(1)
            obj.updateGps([{
                geoCoord: "119.17692,36.6919",
                id: 1,
                lat: 36.6919,
                lon: 119.17692,
                name: "潍坊",
                value: 4468
            }])

        }, 2000)
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
export default gps;