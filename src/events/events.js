'use strict';



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


    on(type, listener) {

        let listeners = this.listeners_[type];
        if (!listeners) {

            listeners = this.listeners_[type] = [];

        }
        if (listeners.indexOf(listener) === -1) {

            listeners.push(listener);

        }

    },
    off(type, listener) {

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

        }

    },
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
}

export default event;