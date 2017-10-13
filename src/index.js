import hymap from './hymap/hymap';
// import hyMapBox from './hyMapBox';
const instances = {};
const DOM_ATTRIBUTE_KEY = '_hy_instance_';
let idBase = new Date() - 0;

/**
 * 全局变量
 * @type {Object}
 * @namespace  hyMap
 */
const config = {
    /**
     * 版本号
     * @memberof hyMap 
     * @type {String}
     */
    version: '0.2.41',
    /**
     * 依赖第三方库 openlayers,turf
     * @memberof hyMap
     * @type {Object}
     */
    dependencies: {
        'openlayers': '4.1.0',
        'turf':'4.4.0'
    },
    /**
     * 是否启用3D
     * @type {Boolean}
     * @memberof hyMap
     * @default false
     */
    ON_WEBGL: false,

    /**
     * 初始化DOM, 返回instance实例
     * @memberof hyMap
     * @alias init
     * @param  {dom}   Elemnt 窗体dom
     * @return {Object}  hymap实例
     * @method 
     */
    init(DOMNode) {

        if (null == DOMNode) {

            throw new Error('请提供合适的dom节点元素');

        }
        const nowID = 'map_' + idBase++;
        let map;
        // if (this.ON_WEBGL) {
        // map = new hyMapBox(DOMNode);
        // } else {
        map = new hymap(DOMNode);
        // }

        instances[nowID] = map;
        if (DOMNode.setAttribute) {

            DOMNode.setAttribute(DOM_ATTRIBUTE_KEY, nowID);

        }
        return map;

    },

    /**
     * 获取当前实例
     * @memberof hyMap
     * @param  {dom}   Elemnt 窗体dom
     * @return {object|null}  object实例
     * @method 
     */
    getInstanceByDom(DOMNode) {

        const key = DOMNode.getAttribute(DOM_ATTRIBUTE_KEY);
        if (!key) {

            console.error('该DOM节点上面没有地图实例');
            return null;

        } else {

            return instances[key];

        }

    }
};
export default config;