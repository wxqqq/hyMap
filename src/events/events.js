'use strict';

/**
 * 事件
 * @module event
 * @type {Object}
 * @mixin   event
 */
const event = {

    pendingRemovals_: {},
    dispatching_: {},
    listeners_: {},
    geoType_: {
        geoselect: {
            'arrayType': 'selected',
            'selected': []
        },
        geounselect: {
            'arrayType': 'deselected',
            'deselected': []
        },
        click: {
            'arrayType': 'selected',
            'selected': []
        },
        unClick: {
            'arrayType': 'deselected',
            'deselected': []
        }
    },

    /**
     * 注册
     * @param  {String}   type     事件类型: click,unClick, hover,unHover,
     * drawClear,drawStart
     * tooltipClick,
     * contextmenu
     * removeOverlay,
     * trackPlayPoint,trackPlayIng,trackPlayStart,trackPlayEnd
     * @param  {Function}   listener 监听方法
     * @return {Function}            监听方法
     */
    on(type, listener) {

        let listeners = this.listeners_[type];
        if (!listeners) {

            listeners = this.listeners_[type] = [];

        }
        if (listeners.indexOf(listener) === -1) {

            listeners.push(listener);

        }
        return listener;

    },

    /**
     * 取消注册事件
     * @param  {String}   type    事件类型
     * @param  {Function}   listener 监听方法
     */
    un(type, listener) {

        if (!type) {

            this.listeners_ = {};

        }
        let listeners = this.listeners_[type];
        if (listeners) {

            const index = listeners.indexOf(listener);
            if (type in this.pendingRemovals_) {

                // make listener a no-op, and remove later in #dispatchEvent()
                listeners[index] = () => {};
                ++this.pendingRemovals_[type];

            } else {

                listeners.splice(index, 1);
                if (listeners.length === 0) {

                    delete this.listeners_[type];

                }

            }

        } else {

            this.listeners_[type] = [];
            delete this.listeners_[type];

        }

    },

    /**
     * 执行事件
     * @param  {Event}   event 事件
     * @return {Boolean}  true/false  执行结果（成功、失败）       
     */
    dispatchEvent(event) {

        let evt = event;
        const type = evt.type;
        evt.target = this;
        let listeners = this.listeners_[type];
        let propagate;
        if (listeners) {

            if (!(type in this.dispatching_)) {

                this.dispatching_[type] = 0;
                this.pendingRemovals_[type] = 0;

            }
            ++this.dispatching_[type];
            for (let i = 0, ii = listeners.length; i < ii; ++i) {

                if (listeners[i].call(this, evt) === false || evt.propagationStopped) {

                    propagate = false;

                    break;

                }

            }
            --this.dispatching_[type];
            if (this.dispatching_[type] === 0) {

                let pendingRemovals = this.pendingRemovals_[type];
                delete this.pendingRemovals_[type];
                while (pendingRemovals--) {

                    this.removeEventListener(type, () => {});

                }
                delete this.dispatching_[type];

            }
            return propagate;

        }

    }
};

export default event;