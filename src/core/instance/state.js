import { isPlainObject } from "../util/index";
import { noop } from "../util/index";

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
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
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
            proxy(vm, `_data`, key)
        }
    }
}

export function getData (data, vm) {
}
