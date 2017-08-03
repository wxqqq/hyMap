import hymap from './hymap/hymap';
import hyMapBox from './hyMapBox';
const instances = {};
const DOM_ATTRIBUTE_KEY = '_hy_instance_';
let idBase = new Date() - 0;

/**
 * 全局变量
 * @type {Object}
 * @namespace  index
 */
const config = {
    /**
     * 版本
     * @memberof index 
     * @type {String}
     */
    version: '0.1.1',
    /**
     * 依赖
     * @memberof index
     * @type {Object}
     */
    dependencies: {
        'openlayers': '4.1.0'
    },
    ON_WEBGL: false,

    /**
     * 初始化DOM, 返回instance实例
     * @memberof index
     * @alias init
     * @param  {dom}   Elemnt 窗体dom
     * @return {Object}  hymap        实例
     * @method 
     */
    init(DOMNode) {

        if (null == DOMNode) {

            throw new Error('请提供合适的dom节点元素');

        }
        const nowID = 'map_' + idBase++;
        let map;
        if (this.ON_WEBGL) {
            map = new hyMapBox(DOMNode);
        } else {
            map = new hymap(DOMNode);
        }

        instances[nowID] = map;
        if (DOMNode.setAttribute) {

            DOMNode.setAttribute(DOM_ATTRIBUTE_KEY, nowID);

        }
        return map;

    },

    /**
     * 获取实例
     * @memberof index
     * @param  {dom}   Elemnt 窗体dom
     * @return {hymap}  hymap        实例
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