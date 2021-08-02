import { isObject, isPlainObject } from "../util/index";

export class Observer {
    constructor (value) {
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
