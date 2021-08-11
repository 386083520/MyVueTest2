import {isUndef, isDef, isPrimitive} from "../../shared/util"
import VNode from "./VNode"
import { SSR_ATTR } from "../../shared/constants";
import { isTrue } from '../util/index'

function sameVnode (a, b) {
    return false // TODO
}

export function createPatchFunction (backend) {
    const { modules, nodeOps } = backend
    function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
        if (isDef(vnode.elm) && isDef(ownerArray)) {
            // TODO
        }
        vnode.isRootInsert = !nested
        if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
            return
        }
        const data = vnode.data
        const children = vnode.children
        const tag = vnode.tag
        if (isDef(tag)) {
            if (true) {

            }
            vnode.elm = vnode.ns? nodeOps.createElementNS(vnode.ns, tag): nodeOps.createElement(tag, vnode)
            setScope(vnode)
            if (false) {
                // TODO
            }else {
                console.log('gsdelm', vnode.elm)
                createChildren(vnode, children, insertedVnodeQueue)
                if (isDef(data)) {
                    // TODO
                }
                insert(parentElm, vnode.elm, refElm)
            }
        } else {
            vnode.elm = nodeOps.createTextNode(vnode.text)
            insert(parentElm, vnode.elm, refElm)
        }
    }
    function setScope (vnode) { // 设置scope

    }
    function createChildren (vnode, children, insertedVnodeQueue) {
        if (Array.isArray(children)) {
            for (let i = 0; i < children.length; ++i) {
                createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
            }
        } else if (isPrimitive(vnode.text)) {

        }
    }
    function insert (parent, elm, ref) {
        if (isDef(parent)) {
            if (isDef(ref)) {
                if (nodeOps.parentNode(ref) === parent) {
                    console.log('gsdinsert', parent, elm, ref)
                    nodeOps.insertBefore(parent, elm, ref)
                }
            }else {
                nodeOps.appendChild(parent, elm)
            }
        }
    }
    function emptyNodeAt (elm) { // 根据真实的element生成vnode
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
                initComponent(vnode, insertedVnodeQueue)
                insert(parentElm, vnode.elm, refElm)
                return true
            }
        }
    }
    function initComponent (vnode, insertedVnodeQueue) {
        if (isDef(vnode.data.pendingInsert)) {
            // TODO
        }
        vnode.elm = vnode.componentInstance.$el
    }
    function invokeDestroyHook (vnode) {

    }
    function patchVnode () {

    }
    function removeNode (el) { // 删除一个真实的element
        const parent = nodeOps.parentNode(el)
        if (isDef(parent)) {
            nodeOps.removeChild(parent, el)
        }
    }
    function removeVnodes (vnodes, startIdx, endIdx) { // 删除vnodes
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx]
            if (isDef(ch)) {
                if (isDef(ch.tag)) {
                    removeAndInvokeRemoveHook(ch)
                }
            }
        }
    }
    function createRmCb (childElm, listeners) {
        function remove () {
            removeNode(childElm)
        }
        return remove
    }
    function removeAndInvokeRemoveHook (vnode, rm) {
        if (isDef(rm) || isDef(vnode.data)) {
            const listeners = []
            if (isDef(rm)) {

            }else {
                rm = createRmCb(vnode.elm, listeners)
            }
            rm()
        } else {
            removeNode(vnode.elm)
        }
    }
    return function patch (oldVnode, vnode, hydrating, removeOnly) {
        if (isUndef(vnode)) {
            if (isDef(oldVnode)) {
                invokeDestroyHook(oldVnode)
            }
            return
        }
        const insertedVnodeQueue = []  // insertedVnodeQueue 在一次 patch 过程中维护的插入的 vnode 的队列
        if (isUndef(oldVnode)) {
            createElm(vnode, insertedVnodeQueue)
        } else {
            const isRealElement = isDef(oldVnode.nodeType) // 判断老节点是不是一个真实的element
            if (!isRealElement && sameVnode(oldVnode, vnode)) { // 通过sameVnode来判断oldVnode和vnode
                patchVnode()
            }else {
                if (isRealElement) { // 如果是一个真实的element,会转化为一个vNode当成oldVnode
                    /*如果节点是一个元素节点，nodeType 属性返回 1。属性节点, nodeType 属性返回 2。文本节点，nodeType 属性返回 3。注释节点，nodeType 属性返回 8。*/
                    if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                        oldVnode.removeAttribute(SSR_ATTR)
                        hydrating = true
                    }
                    if (isTrue(hydrating)) {

                    }
                    oldVnode = emptyNodeAt(oldVnode)
                }
                const oldElm = oldVnode.elm
                const parentElm = nodeOps.parentNode(oldElm)
                console.log('gsdcreateElm', vnode)
                console.log('gsdref', nodeOps.nextSibling(oldElm))
                createElm(vnode, insertedVnodeQueue, parentElm, nodeOps.nextSibling(oldElm)) // nextSibling 属性返回指定节点之后紧跟的节点，在相同的树层级中
                if (isDef(vnode.parent)) {
                    // TODO
                }
                if (isDef(parentElm)) {
                    console.log('gsdoldVnode', oldVnode)
                    removeVnodes([oldVnode], 0, 0)
                } else if (isDef(oldVnode.tag)) {

                }
            }
        }
        console.log('gsdpatch', vnode.elm)
        return vnode.elm
    }
}
