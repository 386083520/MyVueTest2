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

export function parentNode (node) { // 拿到node的parentNode
    return node.parentNode
}

export function createTextNode (text) {
    return document.createTextNode(text)
}

export function nextSibling (node) {
    return node.nextSibling
}

export function insertBefore (parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode)
}

export function removeChild (node, child) { // 移除node指定的子元素
    node.removeChild(child)
}

export function setTextContent (node, text) { // 设置node的文本内容
    node.textContent = text
}

export function createComment (text) {
    return document.createComment(text)
}
