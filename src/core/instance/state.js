import { isPlainObject } from "../util/index";
import { noop } from "../util/index";
import { observe } from "../observer/index";
import { nativeWatch } from "../util/index";

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
}

export function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter (val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

export function initState (vm) {
    vm._watchers = []
    const opts = vm.$options
    if (opts.props) initProps(vm, opts.props)
    if (opts.methods) initMethods(vm, opts.methods)
    if (opts.data) {
        initData(vm)
    }else {
        observe(vm._data = {}, true /* asRootData */)
    }
    if (opts.computed) initComputed(vm, opts.computed)
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch)
    }
}

function initProps (vm, propsOptions) {

}
function initMethods (vm, propsOptions) {

}
function initComputed (vm, propsOptions) {

}
function initWatch (vm, propsOptions) {

}

function initData (vm) {
    let data = vm.$options.data
    console.log('gsddata', data)
    data = vm._data = (typeof data === 'function' ? getData(data, vm): data || {})
    if (!isPlainObject(data)) {
        data = {}
        // TODO
    }
    const keys = Object.keys(data)
    let i = keys.length
    while (i--) {
        const key = keys[i]
        if (false) { // TODO
        }else {
            proxy(vm, `_data`, key) // this._data.aaa -> this.aaa
        }
    }
    observe(data, true /* asRootData */)
}

export function getData (data, vm) {
}
