import {isUndef} from "../../../shared/util";
import { createFnInvoker } from "./update-listeners";

export function mergeVNodeHook (def, hookKey, hook) {
    if (def instanceof VNode) {
        def = def.data.hook || (def.data.hook = {})
    }
    let invoker
    const oldHook = def[hookKey]
    function wrappedHook () {
        hook.apply(this, arguments)
        // TODO
    }
    if (isUndef(oldHook)) {
        invoker = createFnInvoker([wrappedHook])
    }else {

    }
    invoker.merged = true
    def[hookKey] = invoker
}
