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
            // center: [118.62778784888256, 36.58892145091036], //当前视角中心: [经度, 纬度]
            center: [117.39985412253108, 49.51232453845437], //当前视角中心: [经度, 纬度]
            zoom: 8, //当前地图缩放比例
            scaleLimit: [5, 20], //滚轮缩放的边界

            selectedMode: '', //地图区域的选中模式 single mulit
            theme: 'dark', //地图风格
            label: '', //文本标签样式
            series: []
        };
        obj.setOption(options);
        fetch('../test/data/region.json').then(response => response.json()).then(function(values) {

            // values[1].data = [values[1].data[0], values[1].data[1]];
            console.log(values)
                // options.series = [values];
            obj.addLayer({
                id: 1,
                series: [values]
            })

        });


        // fetch('../test/data/traffic_lines.json').then(response => response.json()).then(function(values) {

        //     // values[1].data = [values[1].data[0], values[1].data[1]];
        //     console.log(values[1])
        //     options.series = [values[1]];
        //     obj.setOption(options);

        // });


    }
    render() {

        return (<div id = 'map' > </div>);

    }
}
export default line;