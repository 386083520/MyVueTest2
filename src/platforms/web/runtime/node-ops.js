export function createElement (tagName, vnode) {
    const elm = document.createElement(tagName)
    return elm
}

export function appendChild (node, child) {
    node.appendChild(child)
}

export function tagName(node) {
    return node.tagName
}

export function parentNode (node) {
    return node.parentNode
}

export function createTextNode (text) {
    return document.createTextNode(text)
}
