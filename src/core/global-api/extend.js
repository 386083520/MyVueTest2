import { mergeOptions } from "../util/options"

export function initExtend (Vue) {
    Vue.cid = 0
    let cid = 1
    Vue.extend = function (extendOptions) {
        extendOptions = extendOptions || {}
        const Super = this
        const SuperId = Super.cid
        console.log('gsdSuperId', SuperId)
        const Sub = function VueComponent (options) {
            this._init(options)
        }
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        Sub.cid = cid++
        Sub.options = mergeOptions(
            Super.options,
            extendOptions
        )
        console.log('gsdSub', Sub.cid)
        return Sub
    }
}
