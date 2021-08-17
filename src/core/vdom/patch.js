import {isUndef, isDef, isPrimitive} from "../../shared/util"
import VNode from "./VNode"
import { SSR_ATTR } from "../../shared/constants";
import { isTrue } from '../util/index'

export const emptyNode = new VNode('', {}, [])
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']

// 比对两个vnoode:
// 情况1：tag相同，isComment相同，data有定义
function sameVnode (a, b) {
    return (
        a.key === b.key && (
            (
                a.tag === b.tag &&
                a.isComment === b.isComment &&
                isDef(a.data) === isDef(b.data) &&
                sameInputType(a, b)
            ) || (
                false // TODO
            )
        )
    )
}

function sameInputType (a, b) {
    if (a.tag !== 'input') return true
    // TODO
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
    let i, key
    const map = {}
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key
        if (isDef(key)) map[key] = i
    }
    return map
}

export function createPatchFunction (backend) {
    let i,j
    const cbs = {}
    const { modules, nodeOps } = backend
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = []
        for (j = 0; j < modules.length; ++j) {
            if (isDef(modules[j][hooks[i]])) {
                cbs[hooks[i]].push(modules[j][hooks[i]])
            }
        }
        console.log('gsdcbs', cbs)
    }
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
                    invokeCreateHooks(vnode, insertedVnodeQueue)
                }
                insert(parentElm, vnode.elm, refElm)
            }
        } else if (isTrue(vnode.isComment)) {
            vnode.elm = nodeOps.createComment(vnode.text)
            insert(parentElm, vnode.elm, refElm)
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

    function isPatchable (vnode) { // TODO
        return isDef(vnode.tag)
    }

    function patchVnode (oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
        if (oldVnode === vnode) {
            return
        }
        if (isDef(vnode.elm) && isDef(ownerArray)) { // 在做循环调用的时候会到这个逻辑
            // TODO
            console.log('gsdownerArray')
        }
        const elm = vnode.elm = oldVnode.elm
        if (isTrue(oldVnode.isAsyncPlaceholder)) {
            // TODO
        }
        // TODO
        const data = vnode.data
        // TODO
        const oldCh = oldVnode.children
        const ch = vnode.children
        if (isDef(data) && isPatchable(vnode)) {
            for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
        }

        if (isUndef(vnode.text)) { // 新vnode text isUndef
            if (isDef(oldCh) && isDef(ch)) { // vnode不是一个文本，那就会看有没有子节点
                if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly) // 如果子节点不一样，去处理子节点
            }
        }else if (oldVnode.text !== vnode.text) {
            nodeOps.setTextContent(elm, vnode.text)
        }
        if (isDef(data)) {
            // TODO
        }
    }
    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) { // 更新Children
        let oldStartIdx = 0
        let newStartIdx = 0
        let oldEndIdx = oldCh.length - 1 // oldCh的数组长度
        let oldStartVnode = oldCh[0] // oldCh的一个
        let oldEndVnode = oldCh[oldEndIdx] // oldCh的最后一个
        let newEndIdx = newCh.length - 1 // newCh的数组长度
        let newStartVnode = newCh[0] // newCh的一个
        let newEndVnode = newCh[newEndIdx] // newCh的最后一个
        let oldKeyToIdx, idxInOld
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (isUndef(oldStartVnode)) {

            } else if (isUndef(oldEndVnode)) {

            } else if (sameVnode(oldStartVnode, newStartVnode)) { // 通过sameVnode判断老的和新的，如果返回true，处理，老的和新的都取下一个再循环
                console.log('gsdsameVnode')
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
                oldStartVnode = oldCh[++oldStartIdx]
                newStartVnode = newCh[++newStartIdx]
            } else if (sameVnode(oldEndVnode, newEndVnode)) {

            } else if (sameVnode(oldStartVnode, newEndVnode)) {

            } else if (sameVnode(oldEndVnode, newStartVnode)) {

            } else {
                if(isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 生成老的child key对应的位置的一个map
                idxInOld = isDef(newStartVnode.key)
                    ? oldKeyToIdx[newStartVnode.key]: findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
                if (isUndef(idxInOld)) {
                    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
                } else {
                    // TODO
                }
                newStartVnode = newCh[++newStartIdx]
            }

        }
        if (oldStartIdx > oldEndIdx) {
            // TODO
        }else if(newStartIdx > newEndIdx) {
            removeVnodes(oldCh, oldStartIdx, oldEndIdx)
        }
    }
    function findIdxInOld (node, oldCh, start, end) { // 查找新vnode在老vnode的中的一个位置
        for (let i = start; i < end; i++) {
            const c = oldCh[i]
            if (isDef(c) && sameVnode(node, c)) return i
        }
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
                }else {
                    removeNode(ch.elm)
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
        if (isUndef(vnode)) { // 在$destroy调用的时候会走这个逻辑
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
                patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
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
    function invokeCreateHooks (vnode, insertedVnodeQueue) {
        for (let i = 0; i < cbs.create.length; ++i) {
            cbs.create[i](emptyNode, vnode)
        }
    }
}
