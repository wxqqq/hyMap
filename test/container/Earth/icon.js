'use strict';
import React, {
    Component
} from 'react';
import map from '../../../src/index';

class icon extends Component {
    componentDidMount() {

        let obj = map.init(document.getElementById('map'));
        let options = {
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: 'shandongsheng', //当前地图显示哪个地图
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

            // tooltip: {
            //     show: true,
            //     trigger: ['item', 'geo'], // item、map  ['item', 'geo']
            //     triggeron: 'mouseover', //'click', // click, mouseover, mousemove, dblclick , ['click'],
            //     enterable: true, //true 鼠标是否可进入浮出泡泡框中
            //     style: {
            //         'border-color': '#cc0',
            //         'border-radius': '5',
            //         'border-width': '2',
            //         'border-style': 'solid',
            //         'width': '100',
            //         'height': '60'
            //     },
            //     formatter: function(param) { //div内的内容

            //         return param.dataIndex + ': ' + param.value;

            //     },
            //     position: function() { //相对于当前事件点的位置

            //         return [0, 0];
            //         // return [20, 10];

            //     }
            // }
        };

        fetch('../../../data/car_2012.json').then(response => response.json()).then(function(values) {

            values.forEach(obj => {

                obj.geoCoord = [obj.lon, obj.lat];

            });
            options.series.push({
                data: values,
                type: 'point',
                symbol: 'icon:img/jingli.png',
                symbolSize: [25, 25],
                symbolStyle: {
                    'normal': {
                        symbolSize: [20, 20]
                    },
                    'emphasis': {
                        symbolSize: [30, 30]
                    }
                },
                label: 'mc',
                showPopup: true //显示气泡框
            });
            obj.setOption(options);


            obj.setTooltip({
                show: true,
                trigger: ['item', 'geo'], // item、map  ['item', 'geo']
                triggeron: 'click', //'click', // click, mouseover, mousemove, dblclick , ['click'],
                enterable: true, //true 鼠标是否可进入浮出泡泡框中
                style: {
                    'border-color': '#cc0',
                    'border-radius': '5',
                    'border-width': '2',
                    'border-style': 'solid',
                    'width': '100',
                    'height': '60'
                },
                formatter: function(param) { //div内的内容

                    return param.dataIndex + ': ' + param.value;

                },
                position: function() { //相对于当前事件点的位置

                    return [0, 0];
                    // return [20, 10];

                }
            });


        });

        obj.on('click', function(data) {

            console.log('getdata:', data);
            let str = '';
            for (let i in data.data) {

                str += i + ':' + data.data[i] + '</br>';

            }

        });

        obj.on('unClick', function(data) {

            console.log('getundata:', data);


        });

        //选中
        document.getElementById('select').addEventListener('click', () => {

            obj.dispatchAction({
                type: 'click',
                id: 1
            });

        });
        //取消选中
        document.getElementById('unselect').addEventListener('click', () => {

            obj.dispatchAction({
                type: 'unClick',
                id: 1
            });

        });

    }

    render() {

        return (<div>
            <input id='select' type='button' value='选中'/>
            <input id='unselect' type='button' value='取消选中' />
            <div id = 'map' /> 
            </div>);

    }
}
export default icon;