import {createElement} from "../vdom/create-element";
import { installRenderHelpers } from "./render-helpers/index";
import { resolveSlots } from "./render-helpers/resolve-slots";
import { emptyObject } from "../util/index";

export function initRender (vm) {
    vm._vnode = null // 子树的根 _vnode是它就是组件的vnode对象
    vm._staticTrees = null // v-once的缓存tree
    const options = vm.$options
    const parentVnode = vm.$vnode = options._parentVnode // $vnode的指向是子组件在父节点的占位时的节点
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext)
    vm.$scopedSlots = emptyObject
    vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
    vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
    const parentData = parentVnode && parentVnode.data
    //TODO 给vm的$attrs和$listeners添加setter和getter函数,以及对属性和事件的相关的监听处理
}

export function renderMixin (Vue) {
    installRenderHelpers(Vue.prototype)
    Vue.prototype._render = function () {
        const vm = this
        const { render, _parentVnode } = vm.$options
        if (_parentVnode) {

        }
        vm.$vnode = _parentVnode
        console.log('gsdvue', this)
        let vnode
        vnode = render.call(vm._renderProxy, vm.$createElement)
        console.log('gsdvnode', vnode)
        return vnode
    }
}
