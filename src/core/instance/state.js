import { isPlainObject } from "../util/index";

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

}

export function getData (data, vm) {
}
