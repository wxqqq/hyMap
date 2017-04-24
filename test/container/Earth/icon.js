/*
 * @Author: wxq
 * @Date:   2017-01-16 17:02:11
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-04-21 19:12:41
 * @Email: 304861063@qq.com
 * @File Path: H:\work\hyMap\test\container\Earth\icon.js
 * @File Name: icon.js
 * @Descript: 
 */
'use strict';
import React, {
    Component
} from 'react';
import map from '../../../src/index';

class icon extends Component {
    componentDidMount() {

        let mapObj = map.init(document.getElementById('map'));
        let options = {
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: '', //mapName  格式：undefined|(string|string|string) 为空不加载地图边界信息，否则按传入参数最后一个为当前级别进行数据加载。
            //目前测试数据包括3级，中国各个省，山东省，济南市的区域数据。
            drillDown: true, //是否开启区域点击下钻功能。
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            zoom: 9, //当前地图缩放比例
            scaleLimit: [3, 20], //滚轮缩放的边界
            itemStyle: '', //地图上每块区域的样式
            selectedMode: '', //地图区域的选中模式
            theme: 'dark', //地图风格
            regions: '', //  name: '',特殊区域的样式
            label: '', //文本标签样式
            series: []
        };
        const series = [];
        fetch('../test/data/car_2012.json').then(response => response.json()).then(function(values) {

            values.forEach(mapObj => {

                mapObj.geoCoord = [mapObj.lon, mapObj.lat];

            });

            options.series.push({
                id: 3,
                cluster: {
                    enable: false, //是否开启聚合
                    distance: 50, // number 聚合点之间的距离 默认为20个单位（piex）
                    animationDuration: 700 //聚合动画时间，默认为700毫秒
                },
                // maxZoom: 10, //数据显示最大级别
                // minZoom: 6, //数据显示最小级别
                data: values,
                type: 'point',
                symbol: 'icon:test/data/jingli-1.png',
                symbolSize: [25, 25],
                symbolStyle: {
                    'normal': {
                        symbolSize: [15, 15],
                        fillColor: 'rgb(140,0,140)',
                        strokeWitdh: 1,
                        strokeColor: 'rbg(140,0,140)'
                    },
                    'emphasis': {
                        strokeWitdh: 2,
                        symbolSize: [30, 45]
                    }
                },
                labelColumn: 'value',
                labelSize: [15, 20],
                label: {
                    'normal': {
                        show: false,
                        textStyle: {
                            color: '#fff',
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontFamily: 'sans-serif',
                            fontSize: '16px'
                        }
                    },
                    'emphasis': {
                        show: true,
                        textStyle: {
                            fontSize: '16px'
                        }

                    }
                },
                showPopup: false //显示气泡框
            });
            mapObj.setOption(options);


            mapObj.setTooltip({
                show: true,
                trigger: ['item'], // item、map  ['item', 'geo']
                triggeron: 'click', //'click', // click, mouseover, mousemove, dblclick , ['click'],
                enterable: true, //true 鼠标是否可进入浮出泡泡框中
                style: {
                    'border-color': '#cc0',
                    'border-radius': '5',
                    'border-width': '2',
                    'border-style': 'solid',
                    'width': '80',
                    'height': '30'
                },
                formatter: function(param) { //div内的内容

                    console.log(param);
                    return param.dataIndex + ': ' + param.value;

                },
                position: function() { //相对于当前事件点的位置

                    return [0, 0];
                    // return [20, 10];

                }
            });

        });
        fetch('../test/data/station.json').then(response => response.json()).then(function(values) {
            values.forEach(mapObj => {

                mapObj.geoCoord = [mapObj.lon, mapObj.lat];

            });
            let series = [];
            series.push({
                data: values, //{x,y,value}
                type: 'point', // point|line|polygon|chart|..
                symbol: 'circle', //circle|react|icon
                symbolSize: '', //[min,max]
                symbolStyle: {
                    'normal': {
                        symbolSize: 5,
                        strokeWidth: 1,
                        strokeColor: 'black',
                        fillColor: 'orange'
                    },
                    'emphasis': {
                        symbolSize: 7,
                        strokeWidth: 1,
                        strokeColor: '#fff',
                        fillColor: 'blue'
                    }
                },
                showPopup: false

            });

            mapObj.addLayer({
                id: 5,
                series: series
            });

        });
        mapObj.on('geoSelect', function(data) {

            console.log('getdata:', data);

        });

        mapObj.on('geoUnSelect', function(data) {

            console.log('getundata:', data);


        });
        mapObj.on('click', function(data) {

            console.log('getdata:', data);

        });

        mapObj.on('unClick', function(data) {

            // console.log('getundata:', data);


        });

        //选中
        document.getElementById('select').addEventListener('click', () => {

            mapObj.dispatchAction({
                type: 'click',
                id: 1
            });

        });
        //取消选中
        document.getElementById('unselect').addEventListener('click', () => {

            mapObj.dispatchAction({
                type: 'unClick',
                id: 1
            });

        });

        //筛选
        document.getElementById('filter').addEventListener('click', () => {

            //获取value=4468的feature
            //
            const feature = mapObj.getFeaturesByProperty('name', '潍坊');
            console.log(feature);
            // const xy = feature[0].properties.geoCoord;
            //对feature触发click
            // mapObj.dispatchAction({
            //     type: 'click',
            //     id: feature[0].properties.id
            // });
            //  console.log(mapObj.getPixelFromCoords(xy));
            feature[0].properties.set('value', feature[0].properties.get('value') + 1);


        });


        document.getElementById('remove').addEventListener('click', () => {

            mapObj.removeLayer(5);
            // mapObj.removeSeries(); //清空所有
            // mapObj.removeSeries('id');//清空单个
            // mapObj.removeSeries(['id','id1']);//清空多个

        });

        document.getElementById('add').addEventListener('click', () => {

            mapObj.addLayer({
                id: 5,
                series: series
            });

        });

        document.getElementById('showlayer').addEventListener('click', () => {

            mapObj.showLayer(5);

        });
        document.getElementById('hidelayer').addEventListener('click', () => {

            mapObj.hideLayer(5);

        });
        document.getElementById('return').addEventListener('click', () => {

            mapObj.geoGoBack();

        });
        document.getElementById('hasLayer').addEventListener('click', () => {
            alert(mapObj.hasLayer(5))
        });
        document.getElementById('areaQuery').addEventListener('click', () => {

            mapObj.clearTrackInfo(); //该方法进行对查询到的所有轨迹和tooltip进行移除操作。
            //获取周边查询的结果 参数：1.中心点坐标 经纬度 2.半径 单位为米
            const features = mapObj.spatialQuery([116.98612837827636, 36.6650505841216], 20000);
            console.log(features);
            //进行屏幕移动动画。
            mapObj.flyto(features.geometry);

            //执行遍历。进行轨迹查询.
            for (let key in features.data) {

                const feaArray = features.data[key];
                feaArray.forEach(feature => {

                    mapObj.drawTrack(feature.get('geoCoord'), [116.98612837827636, 36.6650505841216], {
                        tooltipFun: function(data) {

                            const length = (data.length / 1000).toFixed(1);
                            let str = '距离警情地:' + length + '公里' + '<br/>';
                            str += '预计到达时间：' + data.time + '分钟';
                            return str;

                        }
                    });

                });

            }


        });



    }

    render() {

        return (<div>
            <input id='select' type='button' value='选中'/>
            <input id='unselect' type='button' value='取消选中' />
            <input id='filter' type='button' value='筛选' />
            <input id='remove' type='button' value='移除数据' />
            <input id='add' type='button' value='增加数据'/>
            <input id='showlayer' type='button' value='显示数据' />
            <input id='hidelayer' type='button' value='隐藏数据'/>
            <input id='return' type='button' value='返回'/>
            <input id='areaQuery' type='button' value='周边范围查询'/>
            <input id='hasLayer' type='button' value='存在图层'/>
            <div id = 'map' /> 
            </div>);

    }
}
export default icon;