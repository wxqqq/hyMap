/*
 * @Author: wxq
 * @Date:   2017-07-13 09:53:04
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-09-01 16:44:33
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\tools\mixClass.js
 * @File Name: mixClass.js
 * @Descript: 
 */
'use strict';

var mix = (baseClass, ...mixins) => {
    let base = class _Combined extends baseClass {
        constructor(...args) {
            super(...args)
                // mixins.forEach((mixin) => {
                //     mixin.prototype.constructor.call(this)
                // })
        }
    }
    let copyProps = (target, source) => {
        Object.getOwnPropertyNames(source)
            .concat(Object.getOwnPropertySymbols(source))
            .forEach((prop) => {
                if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                    return
                Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop))
            })
    }
    mixins.forEach((mixin) => {
        copyProps(base.prototype, mixin.prototype)
        copyProps(base, mixin)
    })

    return base;
}

export {
    mix
};