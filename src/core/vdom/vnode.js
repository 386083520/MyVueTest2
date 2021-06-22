export default class Vnode {
    constructor (tag, data, children, text, elm, context, componentOptions, asyncFactory) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
        this.elm = elm
        this.context = context
    }
}

export function createTextVNode (val) {
    return new Vnode(undefined, undefined, undefined, String(val))
}
