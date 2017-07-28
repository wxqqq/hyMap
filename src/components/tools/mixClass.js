/*
 * @Author: wxq
 * @Date:   2017-07-13 09:53:04
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-07-13 13:59:14
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\tools\mixClass.js
 * @File Name: mixClass.js
 * @Descript: 
 */
'use strict';

function mix(...mixins) {
    class Mix {}

    for (let mixin of mixins) {
        copyProperties(Mix, mixin);
        copyProperties(Mix.prototype, mixin.prototype);
    }

    return Mix;
}

function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
        if (key !== "constructor" && key !== "prototype" && key !== "name") {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}

export {
    mix
};