import { initExtend } from "./extend"

export function initGlobalAPI (Vue) {
    Vue.options = Object.create(null)
    Vue.options._base = Vue
    initExtend(Vue)
}
