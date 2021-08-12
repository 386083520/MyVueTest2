import { initRender } from "./render"
import { initProxy } from "./proxy"
import { mergeOptions } from "../util/options"
import { initLifecycle, callHook } from "./lifecycle";
import { initState } from "./state";

export function initMixin (Vue) {
    Vue.prototype._init = function (options) {
        debugger
        const vm = this
        if (options && options._isComponent) {
            initInternalComponent(vm, options)
        }else {
            vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm)
            console.log('gsd', vm.$options)
        }
        initProxy(vm)
        initLifecycle(vm)
        initRender(vm)
        callHook(vm, 'beforeCreate')
        initState(vm)
        callHook(vm, 'created')
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

export function initInternalComponent (vm, options) {
    const opts = vm.$options = Object.create(vm.constructor.options)
    const parentVnode = options._parentVnode
    opts.parent = options.parent
    opts._parentVnode = parentVnode
    const vnodeComponentOptions = parentVnode.componentOptions
    opts.propsData = vnodeComponentOptions.propsData
    opts._parentListeners = vnodeComponentOptions.listeners
    opts._renderChildren = vnodeComponentOptions.children
    opts._componentTag = vnodeComponentOptions.tag

}
