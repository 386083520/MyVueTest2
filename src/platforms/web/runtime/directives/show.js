function locateNode (vnode) {
    return vnode
}

export default {
    bind (el, { value }, vnode) {
        console.log('gsdbind', el, value, vnode)
        vnode = locateNode(vnode)
        const originalDisplay = el.__vOriginalDisplay =
            el.style.display === 'none' ? '' : el.style.display
        if (false) { // TODO
        }else {
            el.style.display = value ? originalDisplay : 'none'
        }
    },
    update (el, { value, oldValue }, vnode) {
        if (!value === !oldValue) return
        vnode = locateNode(vnode)
        const transition = '' // TODO
        if (transition) {

        }else {
            el.style.display = value ? el.__vOriginalDisplay : 'none'
        }
    },
    unbind (el, binding, vnode, oldVnode, isDestroy) {
    }
}
