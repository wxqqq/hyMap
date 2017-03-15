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

class circle extends Component {
    componentDidMount() {

        let obj = map.init(document.getElementById('map'));
        let options = {
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: '中国|山东省', //当前地图显示哪个地图
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

        fetch('../../../data/station.json').then(response => response.json()).then(function(values) {

            values.forEach(obj => {

                obj.geoCoord = [Number(obj.lon), Number(obj.lat)];

            });
            options.series.push({
                data: values, //{x,y,value}
                cluster: true,
                distance: 50,
                type: 'point', // point|line|polygon|chart|..
                // symbol: 'rect', //circle|rect|icon
                symbolSize: [5, 5], //[min,max]
                symbolStyle: {
                    'normal': {
                        strokeWidth: 1,
                        strokeColor: 'blue',
                        fillColor: 'orange'
                    },
                    'emphasis': {
                        symbolSize: 3
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
export default circle;