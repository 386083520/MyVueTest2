import {invokeWithErrorHandling} from "../../util/index";

export function createFnInvoker (fns, vm) {
    function invoker () {
        const fns = invoker.fns
        if (Array.isArray(fns)) {
            const cloned = fns.slice()
            for (let i = 0; i < cloned.length; i++) {
                invokeWithErrorHandling(cloned[i], null, arguments, vm, `v-on handler`)
            }
        }
    }
    invoker.fns = fns
    return invoker
}
