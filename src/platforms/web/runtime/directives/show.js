export default {
    bind (el, { value }, vnode) {
        console.log('gsdbind', el, value, vnode)
    },
    update (el, { value, oldValue }, vnode) {
    },
    unbind (el, binding, vnode, oldVnode, isDestroy) {
    }
}
