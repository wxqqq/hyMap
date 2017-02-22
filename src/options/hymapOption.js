'use strict';

export default {
    serverUrl: 'http://192.168.0.50:8080/geoserver', //服务器地址
    show: true, //地图的显示状态 true为显示 false 为不显示
    map: 'shandong', //当前地图显示哪个地图
    roam: 'true', //地图是否开启缩放、平移功能
    center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
    zoom: 2, //当前地图缩放比例
    scaleLimit: [2, 18], //地图放大级别最大、最小级
    itemStyle: {}, //地图上每块区域的样式
    selectedMode: '', //地图区域的选中模式
    theme: 'dark', //地图风格
    regions: '', //  name: '',特殊区域的样式
    label: '', //文本标签样式
    series: []
};