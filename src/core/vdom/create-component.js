import { isUndef, isObject } from "../util/index";
import VNode from './VNode'

export function createComponent (Ctor, data, context, children, tag) {
    console.log('createComponent', context)
    if (isUndef(Ctor)) {
        return
    }
    const baseCtor = context.$options._base
    if (isObject(Ctor)) {
        Ctor = baseCtor.extend(Ctor)
    }
    if (typeof Ctor !== 'function') {
        return
    }
    let asyncFactory
    if (isUndef(Ctor.cid)) {
        // TODO
    }
    data = data || {}
    const propsData = '' // TODO
    const listeners = data.on
    // TODO
    installComponentHooks(data)
    const name = Ctor.options.name || tag
    const vnode = new VNode(
        `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
        data, undefined, undefined, undefined, context,{ Ctor, propsData, listeners, tag, children } ,asyncFactory)
    console.log('gsdvnode', vnode)
    return vnode
}

function installComponentHooks (data) {

    console.log('gsdinstallComponentHooks')
}
