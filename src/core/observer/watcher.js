import { pushTarget, popTarget } from "./dep";
import { queueWatcher } from "./scheduler";

export default class Watcher {
    constructor (vm, expOrFn, cb, options, isRenderWatcher) {
        console.log('gsdvm', vm)
        this.vm = vm
        this.depIds = new Set()
        this.newDepIds = new Set()
        this.newDeps = []
        this.active = true
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
    addDep (dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }
    update () {
        console.log('gsdupdate')
        if (false) { // TODO
        }else {
            queueWatcher(this)
        }
    }
    run () {
        console.log('gsdrun')
        if (this.active) {
            const value = this.get()
        }
    }
    teardown () {
        console.log('gsdteardown') // TODO
    }
}
