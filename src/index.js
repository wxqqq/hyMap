import hymap from './hymap/hymap';

const instances = {};
const DOM_ATTRIBUTE_KEY = '_hy_instance_';
let idBase = new Date() - 0;
const config = {
    version: '0.0.1',
    dependencies: {
        'openlayers': '3.21.0'
    },
    init(DOMNode) {

        if (null == DOMNode) {

            throw new Error('请提供合适的dom节点元素');

        }
        const nowID = 'map_' + idBase++;
        const map = new hymap(DOMNode);
        instances[nowID] = map;
        if (DOMNode.setAttribute) {

            DOMNode.setAttribute(DOM_ATTRIBUTE_KEY, nowID);

        }
        return map;

    },
    getInstanceByDom(DOMNode) {

        const key = DOMNode.getAttribute(DOM_ATTRIBUTE_KEY);
        if (!key) {

            throw new Error('该DOM节点上面没有地图实例');

        } else {

            return instances[key];

        }

    }
};
export default config;