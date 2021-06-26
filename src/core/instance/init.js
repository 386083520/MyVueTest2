import { initRender } from "./render"
import { initProxy } from "./proxy"
import {mergeOptions} from "../util/options"

export function initMixin (Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        if (options && options._isComponent) {

        }else {
            vm.$options = mergeOptions(options || {}, resolveConstructorOptions(vm.constructor), vm)
            console.log('gsd', vm.$options)
        }
        initProxy(vm)

        initRender(vm)
        if (vm.$options.el) {
            console.log('gsd el', vm.$options.el)
            vm.$mount(vm.$options.el)
        }
    }
}

export function resolveConstructorOptions (Ctor) {
    let options = Ctor.options
    // TODO
    return options
}
