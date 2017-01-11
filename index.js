/*
 * @Author: FunctionRun
 * @Date:   2017-01-10 10:15:25
 * @Last Modified by:   FunctionRun
 * @Last Modified time: 2017-01-10 11:40:40
 * @Email: zhangyujie3344521@163.com
 * @File Path: /Users/zhangyujie/GitHub/FEscaffold/index.js
 * @File Name: index.js
 * @Descript:
 */

'use strict';

import hyMap from './src/hymap';

var map = new hyMap();
map.init(document.getElementById('map'));

fetch('test/station.json').then(function(response) {

    return response.json();

}).then(function(data) {

    var options = {
        show: true, //地图的显示状态 true为显示 false 为不显示
        map: 'shandong', //当前地图显示哪个地图
        roam: 'true', //地图是否开启缩放、平移功能
        center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
        zoom: 3, //当前地图缩放比例
        scaleLimit: [5, 7], //滚轮缩放的边界
        itemStyle: '', //地图上每块区域的样式
        selectedMode: '', //地图区域的选中模式
        theme: '', //地图风格
        regions: '', //  name: '',特殊区域的样式
        label: '', //文本标签样式
        series: [{
            data: data,
            type: 'point',
            symbol: '',
            symbolSize: '',
            symbolStyle: '',
            label: 'mc'

        }]
    };

    map.setOption(options);

});