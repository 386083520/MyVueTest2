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
            let data
            const children = ''
            code = `_c('${el.tag}'${data ? `,${data}` : ''}${children ? `,${children}` : ''})`
        }
        return code
    }
}
