/*
 * @Author: 1
 * @Date:   2017-01-10 10:15:25
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-06-14 18:24:07
 * @Email: zhangyujie3344521@163.com
 * @File Path: F:\work\hyMap\test\container\Earth\gps.js
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
            scaleLimit: [1, 12], //滚轮缩放的边界
            selectedMode: '', //地图区域的选中模式
            theme: { // string('dark'，'blue'，'white')|mapObjectr{mapId,key} 对应maobox中的mapid和access_token
                mapId: 'zhangyujie.a80cdc83',
                key: 'sk.eyJ1Ijoiemhhbmd5dWppZSIsImEiOiJkTEp6WDZrIn0.nY5bsQlZegBbb2uGgJ5jEA'
            }, //地图风格
            regions: '', //  name: '',特殊区域的样式
            label: '', //文本标签样式
            series: []
        };

        // options.series.push({
        //     data: [{
        //         driver: 3484586,
        //         geoCoord: "119.17692,36.6919",
        //         id: 1,
        //         lat: 36.6919,
        //         lon: 119.17692,
        //         name: "潍坊",
        //         value: 4468
        //     }], //{x,y,value}
        //     type: 'point', // point|line|polygon|chart|heatmap..
        //     symbol: 'circle', //circle|rect|icon
        //     symbolSize: 10, //[min,max]
        //     symbolStyle: {
        //         'normal': {
        //             strokeWidth: 0,
        //             strokeColor: 'red',
        //             fillColor: 'orange'
        //         },
        //         'emphasis': {
        //             strokeWidth: 1,
        //             // strokeColor: 'green',
        //             fillColor: 'rgb(133,122,55)'
        //         }
        //     },
        //     label: {
        //         'normal': {
        //             show: false,
        //             textStyle: {
        //                 color: 'red'
        //             }
        //         }
        //     },
        //     showPopup: false

        // });
        obj.setOption(options);
        // obj.initgpslayer();

        // obj.updateGps([{
        //     geoCoord: "119.17692,36.6919",
        //     id: 1,
        //     lat: 36.6919,
        //     lon: 119.17692,
        //     name: "潍坊",
        //     value: 4468
        // }])

        obj.on('geoSelect', function(data) {

            console.log('getdata:', data);

        });
        // obj.off('geoSelect', function(data) {

        //     console.log('getdata:', data);

        // });

        obj.on('geoUnSelect', function(data) {

            console.log('getundata:', data);

        });

        // obj.initgpslayer()
        const line = [{
            geoCoord: '119.17692,36.6919'
        }, {
            geoCoord: ' 118.03983,36.81824'
        }, {
            geoCoord: ' 116.98612837827636,36.6650505841216'
        }, {
            geoCoord: '116.60062,35.45594'
        }, {
            geoCoord: '116.077248,35.461552'
        }, {
            geoCoord: '115.99637,36.52161'
        }];

        obj.initTrackData(line);

        document.getElementById('play').addEventListener('click', () => {
            obj.trck.startAnimation(1);
        });
        document.getElementById('stop').addEventListener('click', () => {
            obj.trck.startAnimation(1);
        });


    }
    render() {

        return (<div><input id='play' type='button' value='播放'/><input id='stop' type='button' value='停止'/> <div id = 'map' /> </div>);

    }
}
export default gps;