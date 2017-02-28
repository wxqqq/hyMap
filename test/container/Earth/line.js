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
            map: 'shandongsheng', //当前地图显示哪个地图
            roam: 'true', //地图是否开启缩放、平移功能
            center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            zoom: 7, //当前地图缩放比例
            scaleLimit: [5, 12], //滚轮缩放的边界

            selectedMode: '', //地图区域的选中模式 single mulit
            theme: 'dark', //地图风格

            label: '', //文本标签样式
            series: []
        };

        fetch('../../../data/gdll.json').then(response => response.json()).then(function(values) {

            options.series.push({
                data: values,
                type: 'line',
                symbol: '',
                symbolSize: '',
                symbolStyle: {
                    'normal': {
                        strokeColor: 'red'
                    },
                    'emphasis': {

                    }
                },
                label: 'mc'
            });

            obj.setOption(options);

        });


    }
    render() {

        return (<div id = 'map' > </div>);

    }
}
export default line;