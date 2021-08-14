import {warn} from "../../core/util/index";


import Vue from './runtime/index'
import { query } from "./util/index"
import { cached } from "../../core/util/index";
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from "./util/compat";

const idToTemplate = cached(id => {
    const el = query(id)
    return el && el.innerHTML
})

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (el, hydrating) {
    el = el && query(el) // 通过el查询到el具体对应的element
    console.log('gsdel', el)
    if (el === document.body || el === document.documentElement) { // vue需要不能挂载在body或者html上面
        warn(
            `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
        )
        return this
    }
    const options = this.$options
    if (!options.render) { // 只有在没有传入render的时候才考虑使用template
        let template = options.template
        if (template) { // template几种不同的传入方式处理
            if (typeof template === 'string') {
                if (template.charAt(0) === '#') {
                    template = idToTemplate(template)
                    if (!template) {
                        warn(
                            `Template element not found or is empty: ${options.template}`,
                            this
                        )
                    }
                }
            } else if (template.nodeType) {
                template = template.innerHTML
            } else {
                return this
            }
        }else if(el){ // template没有传入的时候通过el自己去获取
            template = getOuterHTML(el)
        }
        console.log('gsdtemplate', template)
        if (template) {
            /*// TODO
            let render = function(createElement) {
                // return createElement(('div',{attrs:{"id":"app"}},[createElement('h2', 'bcd'), createElement('aaa')],1))
                return createElement('div', [createElement('h1', 'aaa111'), createElement('aaabbb')])
            }*/
            const { render, staticRenderFns } = compileToFunctions(template, {
                outputSourceRange: true,
                shouldDecodeNewlines,
                shouldDecodeNewlinesForHref,
                delimiters: options.delimiters,
            }, this)
            console.log('gsdrender2', render)
            options.render = render
            console.log('gsdstaticRenderFns2', staticRenderFns)
            options.staticRenderFns = staticRenderFns // 静态element处理的时候对应的render函数数组
        }
    }
    mount.call(this, el, hydrating)
}

function getOuterHTML (el) {
    if (el.outerHTML) { // 通过id拿到的整个标签
        return el.outerHTML
    }else {
        const container = document.createElement('div')
        container.appendChild(el.cloneNode(true))
        return container.innerHTML
    }
}

Vue.compile = compileToFunctions // template变成render

export default Vue
