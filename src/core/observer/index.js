import Dep from "./dep";
import { isObject, isPlainObject } from "../util/index";
import { def } from '../util/index'

export class Observer {
    constructor (value) {
        this.value = value
        this.dep = new Dep()
        this.vmCount = 0
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }
    walk (obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }
    observeArray (items) {
    }
}

export function observe (value, asRootData) {
    if (!isObject(value)) { // TODO
        return
    }
    let ob
    if (false) { // TODO
    }else if((Array.isArray(value) || isPlainObject(value))) {
        ob = new Observer(value)
    }
    return ob
}

export function defineReactive (obj, key, val) {
    const dep = new Dep()
    const property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
        return
    }
    // TODO
    if (arguments.length === 2) {
        val = obj[key]
    }
    let childOb = observe(val) // TODO
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter () {
            const value = val
            console.log('gsdget', value)
            if (Dep.target) {
                dep.depend()
            }
            return value
        },
        set: function reactiveSetter (newVal) {
            const value = val
            if (newVal === value) {
                return
            }
            if (false) {
            }else {
                val = newVal
            }
            dep.notify()
        }
    })
}
