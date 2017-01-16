import hymap from './hymap/hymap';

class map extends hymap {
    constructor(dom, options) {

        super(dom, options);

    }

}

const config = {
    init(el) {

        return new map(el);

    }

}

export default config;