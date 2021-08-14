// 遍历ast的树，检测出完全是静态的子树。比如：从来都不需要改变的dom
// 好处：1，在每次re-render的过程中不需要重新生成node；2，patching的过程中可以完全的跳过
export function optimize (root, options) {
    if (!root) return
    markStatic(root)
    markStaticRoots(root, false)
}

function markStatic(node) {
    node.static = isStatic(node)
}

function markStaticRoots (node, isInFor) {
    if (node.type === 1) {

    }
}

function isStatic (node) {
    if (node.type === 2) { // expression直接返回false
        return false
    }
    if (node.type === 3) { // text直接返回true
        return true
    }
    return !!(false)
}
