/*
 * @Author: wxq
 * @Date:   2017-02-13 13:45:00
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-05-26 10:26:32
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\animation\animation.js
 * @File Name: animation.js
 * @Descript: 
 */
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
    centerAndZoom() {

        this._view.animate({
            zoom: this._zoom,
            center: this._coords,
            duration: this.duration
        });

    }
    flyTo(fun) {

        var parts = 1;
        var duration = this.duration;
        var called = false;

        function callback(complete) {
            --parts;
            if (called) {
                setTimeout(fun, duration / 2);
                return;

            }
            if (parts === 0 || !complete) {

                called = true;

            }

        }

        this._view.animate({
            // zoom: this._zoom,
            center: this._coords,
            duration: duration
        }, callback);

        this._view.animate({
            zoom: this._view.getZoom() - 1,
            duration: duration / 2
        }, {
            zoom: this._zoom,
            duration: duration / 2
        }, callback);

    }
}