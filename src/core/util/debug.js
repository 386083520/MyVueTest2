import config from "../config";
import {noop} from "../../shared/util";

export let warn = noop
export let generateComponentTrace = noop

const hasConsole = typeof console !== 'undefined' // 是否有console这个方法

warn = (msg, vm) => {
    const trace = vm ? generateComponentTrace(vm) : ''
    if (config.warnHandler) {
    }else if(hasConsole && (!config.silent)){
        console.error(`[Vue warn]: ${msg}${trace}`)
    }
}

generateComponentTrace = vm => {}

