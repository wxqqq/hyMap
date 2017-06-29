export default {
    id: new Date().getTime(),
    cluster: {
        enable: false, //是否开启聚合
        distance: 50, // number 聚合点之间的距离 默认为20个单位（piex）
        animationDuration: 700 //聚合动画时间，默认为700毫秒
    },
    animation: {
        enable: false, //是否开启动画
        effectType: 'scale', //scale 动画效果类型 ripple 涟漪 scale 图标缩放
        animationThreshold: 2000, // 图标上限，超出该上限后去取消动画效果
        // animationEasing: "", // 动画效果执行方式
        showEffectOn: 'render', //render emphasis 动画显示时机，普通，高亮后
        brushType: 'stroke', //stroke fill 动画方式
        period: 4, //动画执行时长
        scale: 2.5 //缩放比例
    },
    // maxZoom: 10, //数据显示最大级别
    // minZoom: 6, //数据显示最小级别
    data: [],
    type: 'point',
    // symbol: 'icon:img/jingli.png',
    symbol: 'circle', //circle|rect|icon
    symbolSize: [5, 5],
    symbolStyle: {
        'normal': {
            // symbol: 'circle', //circle|react|icon:img/jingli.png
            strokeWidth: 0, //边框宽度
            strokeColor: '#c7a3ed', //边框颜色
            fillColor: 'rgba(0,0,0,0.1)',
            opacity: 0.6, //透明度,
            color: undefined
        },
        'emphasis': {}
    },
    labelSize: [16, 16],
    label: {
        'normal': {
            show: false,
            textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: 'sans-serif',
                fontSize: '12pt',
                offsetX: 0,
                offsetY: 0,
                text: '',
                textAlign: '',
                strokeWidth: '',
                strokeColor: ''
            }
        },
        'emphasis': {}
    },
    contextmenu: false
        // showPopup: false //显示气泡框
};