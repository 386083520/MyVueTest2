import { pushTarget } from "./dep";

export default class Watcher {
    constructor (vm, expOrFn, cb, options, isRenderWatcher) {
        console.log('gsdvm', vm)
        this.vm = vm
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn
        }else {

        }
        this.value = this.lazy
            ? undefined
            : this.get()
    }
    get () {
        pushTarget(this)
        let value
        const vm = this.vm
        try {
            // value = this.getter.call(vm, vm)
            value = this.getter() // TODO
        } catch (e) {
        } finally {
        }
        return value
    }
}
