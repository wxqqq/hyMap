'use strick';
/**
 * 文本原型
 * @module labelModel
 */
export default {
    'normal': {
        /**
         * 颜色
         * @type {String}
         * @public
         */
        color: '#fff',
        /**
         * 样式
         * @type {String}
         */
        fontStyle: 'normal',
        /**
         * 加粗
         * @type {String}
         */
        fontWeight: 'normal',
        /**
         * 字体
         * @type {String}
         */
        fontFamily: 'sans-serif',
        /**
         * 字号
         * @type {String}
         */
        fontSize: '12pt',
        /**
         * x轴偏移
         * @type {Number}
         */
        offsetX: 0,
        /**
         * y轴偏移
         * @type {Number}
         */
        offsetY: 0,
        /**
         * 文本
         * @type {String}
         */
        text: '',
        textAlign: '',
        strokeWidth: '',
        strokeColor: ''
    },
    'emphasis': {
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

    // var colorList = ['#B5FF91', '#94DBFF', '#FFBAFF', '#FFBD9D', '#C7A3ED', '#CC9898', '#8AC007', '#CCC007', '#FFAD5C'];
};