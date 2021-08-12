import { initRender } from "./render"
import { initProxy } from "./proxy"
import { mergeOptions } from "../util/options"
import { initLifecycle, callHook } from "./lifecycle";
import { initState } from "./state";
import { initEvents } from "./events";
import { initInjections, initProvide } from "./inject";
import config from "../config";
import { mark } from "../util/perf";

export function initMixin (Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        if (options && options._isComponent) { // 合并配置
            initInternalComponent(vm, options)
        }else {
            vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm)
            console.log('gsd', vm.$options)
        }
        if (true) { // TODO
            initProxy(vm) // 对vm做代理
        }else {
            vm._renderProxy = vm
        }
        vm._self = vm // 把本身挂载到_self上
        initLifecycle(vm) // 初始化$parent,$root,$children,$refs
        initEvents(vm) //初始化本组件的监听事件对象和Hook事件监听，以及更新父组件的监听器
        initRender(vm) // _vnode, $vnode, $slots, $scopedSlots,_c(),$createElement()初始化
        callHook(vm, 'beforeCreate')
        initInjections(vm)
        initState(vm) // 初始化data,watch,method,props,computed
        initProvide(vm)
        callHook(vm, 'created')
        if (config.performance && mark) {// TODO
            mark(endTag)
        }
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
