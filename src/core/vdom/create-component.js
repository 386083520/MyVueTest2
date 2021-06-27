import { isUndef, isObject } from "../util/index";
import VNode from './VNode'
import { activeInstance } from "../instance/lifecycle"

const componentVNodeHooks = {
    init (vnode, hydrating) {
        console.log('gsdinit')
        if (
            vnode.componentInstance &&
            !vnode.componentInstance._isDestroyed &&
            vnode.data.keepAlive
        ) {

        }else {
            const child = vnode.componentInstance = createComponentInstanceForVnode(
                vnode,
                activeInstance
            )
            child.$mount(hydrating ? vnode.elm : undefined, hydrating)
        }
    },
    prepatch () {
        console.log('gsdprepatch')
    },
    insert () {
        console.log('gsdinsert')
    },
    destroy () {
        console.log('gsddestroy')
    }
}

const hooksToMerge = Object.keys(componentVNodeHooks)

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
    const hooks = data.hook || (data.hook = {})
    for (let i = 0; i < hooksToMerge.length; i++) {
        const key = hooksToMerge[i]
        const existing = hooks[key]
        const toMerge = componentVNodeHooks[key]
        if (existing !== toMerge && !(existing && existing._merged)) {
            hooks[key] = toMerge
        }
    }
    console.log('gsdinstallComponentHooks')
}

export function createComponentInstanceForVnode (vnode, parent) {
    const options = {
        _isComponent: true,
        _parentVnode: vnode,
        parent
    }
    return new vnode.componentOptions.Ctor(options)
}
