import Watcher from '../observer/watcher'
import { noop } from "../util/index"
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
    if (parent && !options.abstract) {
        parent.$children.push(vm)
    }
    console.log('gsdparent', parent)
    vm.$parent = parent
    vm.$children = []
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
        callHook(vm, 'beforeDestroy')
        callHook(vm, 'destroyed')
    }
}

export function mountComponent (vm, el, hydrating) {
    vm.$el = el
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
