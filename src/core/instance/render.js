import {createElement} from "../vdom/create-element";

export function initRender (vm) {
    vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
}

export function renderMixin (Vue) {
    Vue.prototype._render = function () {
        const vm = this
        const { render } = vm.$options
        console.log('gsdrender', vm)
        let vnode
        vnode = render.call(vm._renderProxy, vm.$createElement)
        console.log('gsdvnode', vnode)
        return vnode
    }
}
