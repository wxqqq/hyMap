const ol = require('../../public/lib/ol');

export default class animation {
    constructor(map, geometry, zoom, duration) {

        this.map = map;
        this._view = this.map.getView();
        this.duration = duration || 2000;
        this._zoom = zoom || 8;
        this._geometry = geometry;
        this._coords = geometry.getCoordinates();

    }
    createBounce(duration, start) {

        start = start || +new Date();
        var bounce = ol.animation.bounce({
            duration: duration,
            resolution: 2 * this._view.getResolution(),
            start: start
        });
        return bounce;

    }
    createPan(duration, start) {

        start = start || +new Date();
        var pan = ol.animation.pan({
            duration: duration,
            source: (this._view.getCenter()),
            start: start
        });
        return pan;

    }
    createRotate(duration, start) {

        start = start || +new Date();
        var rotate = ol.animation.rotate({
            duration: duration,
            resolution: 2 * this._view.getResolution(),
            start: start
        });
        return rotate;

    }
    createZoom(duration, start) {

        start = start || +new Date();
        var zoom = ol.animation.zoom({
            duration: duration,
            resolution: 2 * this._view.getResolution(),
            start: start
        });
        return zoom;

    }
    centerAndZoom() {

        var pan = this.createPan(this.duration);
        var zoom = this.createZoom(this.duration);
        this.map.beforeRender(pan, zoom);
        this._view.fit(this._geometry, {
            maxZoom: this._zoom
        });

    }
    flyTo() {

        var bounce = this.createBounce(this.duration);
        var pan = this.createPan(this.duration);
        this.map.beforeRender(pan, bounce);
        this._view.setZoom(this._zoom);
        this._view.setCenter(this._coords);

    }
}