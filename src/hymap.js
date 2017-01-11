var ol=require('openlayers');
var olstyle=require('openlayers/css/ol.css');
export default class hymap {
    constructor(options) {

        console.log(options);

    }

    init(dom) {

        this.map = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target: dom,
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }),
            view: new ol.View({
                center: [0, 0],
                zoom: 2
            })
        });
        return this;

    }

    on(){

    }
    off(){
    	
    }
}