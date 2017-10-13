/*
 * @Author: wxq
 * @Date:   2017-08-14 16:49:41
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-08-14 16:58:37
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\test\container\event.js
 * @File Name: event.js
 * @Descript: 
 */
'use strict';
var EventEmitter = {
    _events: {},
    dispatch: function(event, data) {

        if (!this._events[event]) { // 没有监听事件

            return;
        
        }
        for (var i = 0; i < this._events[event].length; i++) {

            this._events[event][i](data);
        
        }
    
    },
    subscribe: function(event, callback) {

        // 创建一个新事件数组
        if (!this._events[event]) {

            this._events[event] = [];
        
        }
        this._events[event].push(callback);
    
    }
};
export {
    EventEmitter
};
// otherObject.subscribe('namechanged', function(data) { alert(data.name); });
// this.dispatch('namechanged', { name: 'John' });