import Watcher from '../observer/watcher'
import { noop } from "../util/index"

export let activeInstance = null

export function setActiveInstance(vm) {
    const prevActiveInstance = activeInstance
    activeInstance = vm
    return () => {
        activeInstance = prevActiveInstance
    }
}

export function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
        const vm = this
        const prevVnode = vm._vnode
        const restoreActiveInstance = setActiveInstance(vm)
        if (!prevVnode) {
            vm.__patch__(vm.$el, vnode, hydrating, false)
        }
        restoreActiveInstance()
    }
}

export function mountComponent (vm, el, hydrating) {
    vm.$el = el
    let updateComponent
    updateComponent = () => {
        vm._update(vm._render(), hydrating)
    }
    console.log(vm._update(vm._render(), hydrating))
    new Watcher(vm, updateComponent, noop, {}, true)
    return vm
}
