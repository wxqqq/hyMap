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
            map: 'shandong', //当前地图显示哪个地图
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
        };

        fetch('../../../data/car_2012.json').then(response => response.json()).then(function(values) {

            options.series.push({
                data: values,
                type: 'point',
                symbol: 'icon:img/jingli.png',
                symbolSize: '',
                symbolStyle: {
                    'normal': {
                        symbolwidth: 25,
                        symbolheight: 25
                    },
                    'emphasis': {

                    }
                },
                label: 'mc',
                showPopup: true //显示气泡框
            });
            obj.setOption(options);

        });

        obj.on('geoSelect', function(data) {

            console.log('getdata:', data);
            let str = '';
            for (let i in data.data) {

                str += i + ':' + data.data[i] + '</br>';

            }
            data.element.innerHTML = str;

        });

        obj.on('geoUnSelect', function(data) {

            console.log('getundata:', data);


        });

        //选中
        document.getElementById('select').addEventListener('click', () => {

            obj.dispatchAction({
                type: 'geoselect',
                id: 1
            });

        });
        //取消选中
        document.getElementById('unselect').addEventListener('click', () => {

            obj.dispatchAction({
                type: 'geounselect',
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