export function generate (ast, options) {
    const state = ''
    const code = ast ? genElement(ast, state) : '_c("div")'
    return {
        render: `with(this){return ${code}}`, // TODO
        staticRenderFns: {}
    }
}

export function genElement (el, state) {
    if (false) { // TODO
    }else {
        let code
        if (el.component) {
            // TODO
        }else {
            // {staticClass:"container"},[_v("aaa")]
            let data
            if (true) { // TODO
                data = genData(el, state)
            }
            const children = genChildren(el, state, true) // TODO
            code = `_c('${el.tag}'${data ? `,${data}` : ''}${children ? `,${children}` : ''})`
        }
        return code
    }
}

export function genData (el, state) {

}

export function genChildren (el, state, checkSkip, altGenElement, altGenNode) {
    const children = el.children
    if (children.length) {
        const el = children[0]
        const gen = altGenNode || genNode
        return `[${children.map(c => gen(c, state)).join(',')}]`
    }
}

function genNode (node, state) {
    if (node.type === 1) {

    } else if (node.type === 3 && node.isComment) {

    } else {
        return genText(node)
    }
}

function genText (text) {
    return ("_v(" + (transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function transformSpecialNewlines (text) {
    return text
}
