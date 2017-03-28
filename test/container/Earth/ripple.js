'use strict';
import React, {
    Component
} from 'react';
import map from '../../../src/index';

class ripple extends Component {
    componentDidMount() {

        let obj = map.init(document.getElementById('map'));
        let options = {
            show: true, //地图的显示状态 true为显示 false 为不显示
            map: '', //mapName  格式：undefined|(string|string|string) 为空不加载地图边界信息，否则按传入参数最后一个为当前级别进行数据加载。
            //目前测试数据包括3级，中国各个省，山东省，济南市的区域数据。
            drillDown: true, //是否开启区域点击下钻功能。
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            zoom: 7, //当前地图缩放比例
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

            values.forEach(obj => {

                obj.geoCoord = [obj.lon, obj.lat];

            });

            options.series.push({
                id: 3,
                animation: {
                    enable: true, //是否开启动画
                    effectType: 'ripple', //scale 动画效果类型 ripple 涟漪 scale 图标缩放
                    animationThreshold: 2000, // 图标上限，超出该上限后去取消动画效果
                    // showEffectOn: 'render', //未生效 render emphasis 动画显示时机，普通，高亮后
                    brushType: 'stroke', //stroke fill 动画方式 动画类型为ripple时生效
                    period: 4, //动画执行时长
                    scale: 2.5 //缩放比例
                },
                // maxZoom: 10, //数据显示最大级别
                // minZoom: 6, //数据显示最小级别
                data: values,
                type: 'point',
                symbol: 'circle',
                symbolSize: [25, 25],
                symbolStyle: {
                    'normal': {
                        symbolSize: [15, 15],
                        fillColor: 'rgb(140,89,40)',
                        strokeColor: 'rbg(140,0,140)'
                    },
                    'emphasis': {
                        symbolSize: [30, 30]
                    }
                },
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
                    }
                },
                showPopup: true //显示气泡框
            });
            obj.setOption(options);

        });

    }

    render() {

        return (<div>
          
            <div id = 'map' /> 
            </div>);

    }
}
export default ripple;