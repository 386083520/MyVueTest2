import { pluckModuleFunction } from "../helpers";
import {baseWarn} from "../helpers";
import baseDirectives from '../directives/index'
import { extend, no } from "../../shared/util";

export class CodegenState {
    constructor (options) {
        this.options = options // finalOptionss，经过合并后的
        this.warn = options.warn || baseWarn
        this.transforms = pluckModuleFunction(options.modules, 'transformCode')
        this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
        this.directives = extend(extend({}, baseDirectives), options.directives)
        const isReservedTag = options.isReservedTag || no // 是否是保留标签
        this.maybeComponent = (el) => !!el.component || !isReservedTag(el.tag)  // 是否是组件
        this.staticRenderFns = []
        console.log('gsddataGenFns', this.dataGenFns)
    }
}

export function generate (ast, options) {
    const state = new CodegenState(options)
    const code = ast ? genElement(ast, state) : '_c("div")'
    return {
        render: `with(this){return ${code}}`, // TODO
        staticRenderFns: state.staticRenderFns
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
            if (!el.plain) { // TODO
                data = genData(el, state)
            }
            const children = genChildren(el, state, true) // TODO
            code = `_c('${el.tag}'${data ? `,${data}` : ''}${children ? `,${children}` : ''})`
        }
        return code
    }
}

export function genData (el, state) {
    let data = '{'
    for (let i = 0; i < state.dataGenFns.length; i++) {
        data += state.dataGenFns[i](el)
    }
    data = data.replace(/,$/, '') + '}'
    console.log('gsddata', data)
    return data
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
    // return ("_v(" + (transformSpecialNewlines(JSON.stringify(text.text))) + ")")
    return `_v(${text.type === 2 ? text.expression: transformSpecialNewlines(JSON.stringify(text.text))})`
}

function transformSpecialNewlines (text) {
    return text
}
