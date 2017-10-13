'use strick';

/**
 * 图标原型
 * @module symbolModel
 */
export default {
    'normal': {
        symbol: 'circle', //circle|react|icon:img/jingli.png
        symbolSize: 3, //图形大小
        strokeWidth: 1, //边框宽度
        strokeColor: '#c7a3ed', //边框颜色
        fillColor: 'rgba(0,0,0,0.1)',
        opacity: 0.6, //透明度
        color: undefined, //颜色
        anchor: [0.5, 0.5]//锚点
    },
    'emphasis': {
        symbol: 'circle', //circle|react|icon:img/jingli.png
        symbolSize: 1, //图形大小
        strokeWidth: 1, //边框宽度
        strokeColor: 'rgb(130,141,137)', //边框颜色
        fillColor: 'rgba(255,255,0,1)',//填充色
        opacity: 0.8, //透明度
        color: undefined,//颜色
        anchor: [0.5, 1]//锚点
    }
};