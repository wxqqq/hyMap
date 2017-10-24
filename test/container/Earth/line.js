'use strict';
import React, {
    Component
} from 'react';
import map from '../../../src/index';

class line extends Component {
    componentDidMount() {

        let obj = map.init(document.getElementById('map'));
        let options = {
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: '', //当前地图显示哪个地图
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            // center: [117.39985412253108, 49.51232453845437], //当前视角中心: [经度, 纬度]
            zoom: 4, //当前地图缩放比例
            scaleLimit: [4, 20], //滚轮缩放的边界

            selectedMode: '', //地图区域的选中模式 single mulit
            theme: 'dark', //地图风格
            label: '', //文本标签样式
            series: [],
            extent:[66.94,29.52,148.23,43.33]
        };
        obj.setOption(options);

        fetch('../test/data/yangzhou.json').then(response => response.json()).then(function(values) {

            // values[1].data = [values[1].data[0], values[1].data[1]];
            let red = [],
                yellow = [],
                green = [],
                array = [];
            let features = values.features;
            let yell = [48, 470, 141, 54, 1, 357, 150, 266, 235, 241, 347, 393];
            features.forEach((feature, index) => {


                let obj = {
                    id: feature.properties.OBJECTID_1,
                    value: index,
                    geoCoord: feature.geometry.coordinates[0].join(';'),
                    ref: feature.properties.ref
                };
                if (obj.id == 225 || obj.id == 26 || obj.id == 110 || obj.id == 440 || obj.id == 24 || obj.id == 139 || obj.id == 20 || obj.id == 64 || obj.id == 66 || obj.id == 36 || obj.id == 183 || obj.id == 389 || obj.id == 169) {

                    red.push(obj);
                    obj.state = 3;
                
                } else if (yell.indexOf(obj.id) > -1) {

                    yellow.push(obj);
                    obj.state = 2;
                
                } else {

                    obj.state = 1;
                    green.push(obj);
                
                }
                array.push(obj);
            
            });


            let serie = [{
                'type': 'line',
                'symbol': '',
                'symbolSize': [10, 20],
                'symbolStyle': {
                    'normal': {
                        'strokeWidth': 3,
                        'symbolSize': [10, 20],
                        'strokeColor': 'green'
                    },
                    'emphasis': {}
                },
                'data': green
            }, {
                'type': 'line',
                'symbol': '',
                'symbolSize': [10, 20],
                'symbolStyle': {
                    'normal': {
                        'strokeWidth': 3,
                        'symbolSize': [10, 20],
                        'strokeColor': 'red'
                    },
                    'emphasis': {}
                },
                'data': red
            }, {
                'type': 'line',
                'symbol': '',
                'symbolSize': [10, 20],
                'symbolStyle': {
                    'normal': {
                        'strokeWidth': 3,
                        'symbolSize': [10, 20],
                        'strokeColor': 'yellow'
                    },
                    'emphasis': {}
                },
                'data': yellow
            }];


            // console.log(JSON.stringify(array));
            // options.series = [values];
            obj.addLayer({
                id: 1,
                series: serie
            });
        
        });


        fetch('../test/data/qhline.json').then(response => response.json()).then(function(values) {

            // values[1].data = [values[1].data[0], values[1].data[1]];
            //     let red = [],
            //         yellow = [],
            //         green = [],
            //         array = [];
            //     let features = values.features;
            //     let yell = [48, 470, 141, 54, 1, 357, 150, 266, 235, 241, 347, 393];
            //     features.forEach((feature, index) => {

            //         let obj = {
            //             id: feature.properties.OBJECTID,
            //             value: index,
            //             geoCoord: feature.geometry.coordinates.join(';')
            //         }


            //         if (Math.round(Math.random() / 1.8)) {
            //             red.push(obj);
            //             obj.state = 3;
            //         } else if (Math.round(Math.random() / 1.95)) {
            //             yellow.push(obj);
            //             obj.state = 2;
            //         } else {
            //             obj.state = 1;
            //             green.push(obj);
            //         }
            //         array.push(obj);
            //     })

            //     let serie = [{
            //         "type": "line",
            //         "symbol": "",
            //         "symbolSize": [10, 20],
            //         "symbolStyle": {
            //             "normal": {
            //                 "strokeWidth": 3,
            //                 "symbolSize": [10, 20],
            //                 "strokeColor": "green"
            //             },
            //             "emphasis": {}
            //         },
            //         data: green
            //     }, {
            //         "type": "line",
            //         "symbol": "",
            //         "symbolSize": [10, 20],
            //         "symbolStyle": {
            //             "normal": {
            //                 "strokeWidth": 3,
            //                 "symbolSize": [10, 20],
            //                 "strokeColor": "red"
            //             },
            //             "emphasis": {}
            //         },
            //         data: red
            //     }, {
            //         "type": "line",
            //         "symbol": "",
            //         "symbolSize": [10, 20],
            //         "symbolStyle": {
            //             "normal": {
            //                 "strokeWidth": 3,
            //                 "symbolSize": [10, 20],
            //                 "strokeColor": "yellow"
            //             },
            //             "emphasis": {}
            //         },
            //         data: yellow
            //     }]


            //     console.log(JSON.stringify(array));
            //     // options.series = [values];
            //     obj.addLayer({
            //         id: 2,
            //         series: serie
            //     })
        });
        // fetch('../test/data/region.json').then(response => response.json()).then(function(values) {

        //     // values[1].data = [values[1].data[0], values[1].data[1]];
        //     // console.log(values)
        //     // options.series = [values];
        //     obj.addLayer({
        //         id: 1,
        //         series: [values]
        //     })

        // });


        // fetch('../test/data/traffic_lines.json').then(response => response.json()).then(function(values) {

        //     // values[1].data = [values[1].data[0], values[1].data[1]];
        //     // console.log(values[1])
        //     options.series = values;
        //     obj.setOption(options);

        // });
        let s = [];
        obj.on('click', function(data) {

            console.log('getdata:', data.data.id);
            s.push(data.data.id);
            console.log(s);
        
        });

    }
    render() {

        return (<div id = 'map' > </div>);

    }
}
export default line;