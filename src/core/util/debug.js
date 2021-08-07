import config from "../config";
import {noop} from "../../shared/util";

export let warn = noop
export let tip = noop
export let generateComponentTrace = noop
export let formatComponentName = noop

const hasConsole = typeof console !== 'undefined' // 是否有console这个方法

if(true) { // TODO
    warn = (msg, vm) => { // 代码异常情况的警告处理
        const trace = vm ? generateComponentTrace(vm) : ''
        if (config.warnHandler) {
        }else if(hasConsole && (!config.silent)){
            console.error(`[Vue warn]: ${msg}${trace}`)
        }
    }
    tip = (msg, vm) => {
        if (hasConsole && (!config.silent)) {
            console.warn(`[Vue tip]: ${msg}` + (
                vm ? generateComponentTrace(vm) : ''
            ))
        }
    }

    formatComponentName = (vm, includeFile) => {
        console.log('gsdvm', vm)
        if (vm.$root === vm || true) {
            return '<Root>'
        }
    }

    generateComponentTrace = vm => {
        if (vm._isVue && vm.$parent) { // TODO

        } else {
            return `\n\n(found in ${formatComponentName(vm)})`
        }
    }
}

