export default class VNode {
    constructor (tag, data, children, text, elm, context, componentOptions, asyncFactory) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
        this.elm = elm
        this.context = context
        this.componentOptions = componentOptions
        this.asyncFactory = asyncFactory
        this.key = data && data.key
        this.isComment = false
    }
}

export function createTextVNode (val) {
    return new VNode(undefined, undefined, undefined, String(val))
}

export const createEmptyVNode = (text = '') => {
    const node = new VNode()
    node.text = text
    node.isComment = true
    return node
}
