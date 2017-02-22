'use strick';

export default {
    'normal': {
        symbol: 'circle', //circle|react|icon:img/jingli.png
        radius: 3,
        symbolSize: '', //图形大小
        strokeWidth: 1, //边框宽度
        strokeColor: 'red', //边框颜色
        fillColor: 'green',
        opacity: 0.6 //透明度
    },
    'emphasis': {
        symbol: 'circle', //circle|react|icon:img/jingli.png
        radius: 5,
        symbolSize: '', //图形大小
        strokeWidth: 3, //边框宽度
        strokeColor: 'red', //边框颜色
        fillColor: '#94DBFF',
        opacity: 0.8 //透明度
    }

    // getColorByRandom(colorList) {
    //     var colorList = ['#B5FF91', '#94DBFF', '#FFBAFF', '#FFBD9D', '#C7A3ED', '#CC9898', '#8AC007', '#CCC007', '#FFAD5C'];

    //     var colorIndex = Math.floor(Math.random() * colorList.length);
    //     var color = colorList[colorIndex];
    //     return color;
    // }
};