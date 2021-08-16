// 遍历ast的树，检测出完全是静态的子树。比如：从来都不需要改变的dom
// 好处：1，在每次re-render的过程中不需要重新生成node；2，patching的过程中可以完全的跳过
export function optimize (root, options) {
    if (!root) return
    markStatic(root)
    markStaticRoots(root, false)
}

function markStatic(node) {
    node.static = isStatic(node)
    if (node.type === 1) {
        if (false) { // TODO
        }
        for (let i = 0, l = node.children.length; i < l; i++) {
            const child = node.children[i]
            markStatic(child)
            if (!child.static) {
                node.static = false
            }
        }
        if (node.ifConditions) {
            // TODO
        }
    }
}

function markStaticRoots (node, isInFor) {
    if (node.type === 1) {
        if (node.static && node.children.length && !( // 满足staticRoot的条件：是static，并且有children，children的类型不能说纯文本
            node.children.length === 1 &&
            node.children[0].type === 3
        )) {
            node.staticRoot = true
            return
        }else {
            node.staticRoot = false
        }
        if (node.children) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                markStaticRoots(node.children[i], isInFor || !!node.for)
            }
        }
    }
}

function isStatic (node) {
    if (node.type === 2) { // expression直接返回false
        return false
    }
    if (node.type === 3) { // text直接返回true
        return true
    }
    return !!( // TODO
        !node.if && !node.hasBindings
    )
}
