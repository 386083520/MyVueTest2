import {isUndef, isDef, isPrimitive} from "../../shared/util"
import VNode from "./VNode"

export function createPatchFunction (backend) {
    const { modules, nodeOps } = backend
    function createElm (vnode, insertedVnodeQueue, parentElm, refElm) {
        if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
            return
        }
        const data = vnode.data
        const children = vnode.children
        const tag = vnode.tag
        if (isDef(tag)) {
            vnode.elm = nodeOps.createElement(tag, vnode)
            console.log('gsdelm', vnode.elm)
            createChildren(vnode, children, insertedVnodeQueue)
            insert(parentElm, vnode.elm)
        } else {
            vnode.elm = nodeOps.createTextNode(vnode.text)
            insert(parentElm, vnode.elm)
        }
    }
    function createChildren (vnode, children, insertedVnodeQueue) {
        if (Array.isArray(children)) {
            for (let i = 0; i < children.length; ++i) {
                createElm(children[i], insertedVnodeQueue, vnode.elm)
            }
        } else if (isPrimitive(vnode.text)) {

        }
    }
    function insert (parent, elm, ref) {
        if (isDef(parent)) {
            if (isDef(ref)) {

            }else {
                nodeOps.appendChild(parent, elm)
            }
        }
    }
    function emptyNodeAt (elm) {
        return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }
    function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
        let i = vnode.data
        if (isDef(i)) {
            const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
            if (isDef(i = i.hook) && isDef(i = i.init)) {
                i(vnode, false)
            }
            if (isDef(vnode.componentInstance)) {
                console.log('gsdreturn')
                // return true
            }
        }
    }
    return function patch (oldVnode, vnode, hydrating, removeOnly) {
        const insertedVnodeQueue = []
        if (isUndef(oldVnode)) {

        } else {
            const isRealElement = isDef(oldVnode.nodeType)
            if (isRealElement) {
                oldVnode = emptyNodeAt(oldVnode)
            }
            const oldElm = oldVnode.elm
            const parentElm = nodeOps.parentNode(oldElm)
            console.log('gsdSibling', nodeOps.nextSibling(oldElm))
            createElm(vnode, insertedVnodeQueue, parentElm, nodeOps.nextSibling(oldElm))
        }
    }
}
