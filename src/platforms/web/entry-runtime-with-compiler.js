import {warn} from "../../core/util/index";

import Vue from './runtime/index'
import { query } from "./util/index"
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from "./util/compat";

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (el, hydrating) {
    el = el && query(el)
    console.log('gsdel', el)
    if (el === document.body || el === document.documentElement) { // vue需要不能挂载在body或者html上面
        warn(
            `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
        )
        return this
    }
    const options = this.$options
    /*if(options._componentTag) {
        let render = function(createElement) {
            return createElement('div', 'aaab222')
        }
        options.render = render
    }*/
    if (!options.render) {
        let template = options.template
        if (template) {
            if (typeof template === 'string') {
                if (template.charAt(0) === '#') {

                }
            } else if (template.nodeType) {

            } else {
                return this
            }
        }else if(el){
        }
        if (template) {
            /*// TODO
            let render = function(createElement) {
                // return createElement(('div',{attrs:{"id":"app"}},[createElement('h2', 'bcd'), createElement('aaa')],1))
                return createElement('div', [createElement('h1', 'aaa111'), createElement('aaabbb')])
            }*/
            const { render, staticRenderFns } = compileToFunctions(template, {
                shouldDecodeNewlines,
                shouldDecodeNewlinesForHref,
                delimiters: options.delimiters,
            }, this)
            console.log('gsdrender2', render)
            options.render = render
        }
    }
    mount.call(this, el, hydrating)
}
export default Vue
