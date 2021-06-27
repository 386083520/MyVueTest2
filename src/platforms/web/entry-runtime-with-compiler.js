import Vue from './runtime/index'
import { query } from "./util/index"

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (el, hydrating) {
    el = el && query(el)
    const options = this.$options
    if(options._componentTag) {
        let render = function(createElement) {
            return createElement('div', 'aaab')
        }
        options.render = render
    }
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
            // TODO
            let render = function(createElement) {
                // return createElement(('div',{attrs:{"id":"app"}},[createElement('h2', 'bcd'), createElement('aaa')],1))
                return createElement('div', [createElement('h1', 'aaa'), createElement('aaabbb')])
            }
            console.log('gsdoptions', options)
            options.render = render
        }
    }
    mount.call(this, el, hydrating)
}
export default Vue
