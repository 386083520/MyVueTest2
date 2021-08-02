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
