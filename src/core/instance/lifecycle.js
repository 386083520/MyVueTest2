import Watcher from '../observer/watcher'
import { noop, remove } from "../util/index"
import {invokeWithErrorHandling} from "../util/error";

export let activeInstance = null

export function setActiveInstance(vm) {
    const prevActiveInstance = activeInstance
    activeInstance = vm
    return () => {
        activeInstance = prevActiveInstance
    }
}

export function initLifecycle (vm) {
    const options = vm.$options
    let parent = options.parent
    if (parent && !options.abstract) { //定位到第一个非抽象的parent
        while (parent.$options.abstract && parent.$parent) {
            parent = parent.$parent
        }
        parent.$children.push(vm)
    }
    console.log('gsdparent', parent)
    vm.$parent = parent // 指定vm的$parent
    vm.$root = parent ? parent.$root : vm // 指定vm的$root
    vm.$children = []
    vm.$refs = {}
    // TODO
}

export function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
        const vm = this
        const prevVnode = vm._vnode
        const restoreActiveInstance = setActiveInstance(vm)
        vm._vnode = vnode
        if (!prevVnode) {
            vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false, vm.$options._parentElm, vm.$options._refElm)
            vm.$options._parentElm = vm.$options._refElm = null;
        } else {
            vm.$el = vm.__patch__(prevVnode, vnode)
        }
        restoreActiveInstance()
    }
    Vue.prototype.$destroy = function () {
        const vm = this
        if (vm._isBeingDestroyed) { // 当前vm正在走$destroy的逻辑
            return
        }
        // 啥都没做，只是提醒要销毁了
        callHook(vm, 'beforeDestroy')
        vm._isBeingDestroyed = true
        const parent = vm.$parent
        if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) { // 如果parent存在，且没有在销毁中，且当前vm不是abstract
            remove(parent.$children, vm) // 我们把vm从parent里面移除掉
        }
        if (vm._watcher) { // 移除掉数据监听
            //TODO
        }
        let i = vm._watchers.length
        while (i--) {
            //TODO _watchers移除
        }
        vm._isDestroyed = true
        vm.__patch__(vm._vnode, null) // 把子组件都做销毁
        // 接触关联关系；销毁子组件
        callHook(vm, 'destroyed')
        vm.$off()
        if (vm.$el) {
            // TODO
        }
        if (vm.$vnode) {
            // TODO
        }
    }
}

export function mountComponent (vm, el, hydrating) {
    vm.$el = el
    // 将el转化为element;得到template;得到render
    callHook(vm, 'beforeMount')
    let updateComponent
    updateComponent = () => {
        vm._update(vm._render(), hydrating)
    }
    console.log('gsdmountComponent')
    new Watcher(vm, updateComponent, noop, {
        before () {
            callHook(vm, 'beforeUpdate')
        }
    }, true)
    // watcher；生成虚拟dom;页面的渲染
    callHook(vm, 'mounted')
    return vm
}

export function activateChildComponent (vm, direct) {
    callHook(vm, 'activated')
}

export function deactivateChildComponent (vm, direct) {
    callHook(vm, 'deactivated')
}

export function callHook (vm, hook) {
    const handlers = vm.$options[hook]
    console.log('gsdhandlers', handlers)
    const info = `${hook} hook`
    console.log('gsd', handlers)
    if (handlers) {
        for (let i = 0, j = handlers.length; i < j; i++) {
            invokeWithErrorHandling(handlers[i], vm, null, vm, info)
        }
    }
}
