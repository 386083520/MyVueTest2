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
    },
    unbind (el, binding, vnode, oldVnode, isDestroy) {
    }
}
