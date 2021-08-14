export function renderStatic (index, isInFor) {
    console.log('gsdrenderStatic')
    const cached = this._staticTrees || (this._staticTrees = [])
    let tree = cached[index]
    if (tree && !isInFor) {
        return tree
    }
    console.log('gsdstaticRenderFns', this.$options.staticRenderFns[index])
    tree = cached[index] = this.$options.staticRenderFns[index].call(
        this._renderProxy,
        null,
        this
    )
    markStatic(tree, `__static__${index}`, false)
    console.log('gsdtree', tree)
    return tree
}

function markStatic (tree, key, isOnce) {
    if (Array.isArray(tree)) {
        // TODO
    } else {
        markStaticNode(tree, key, isOnce)
    }
}

function markStaticNode (node, key, isOnce) {
    node.isStatic = true
    node.key = key
    node.isOnce = isOnce
}
