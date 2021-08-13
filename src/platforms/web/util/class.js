import { isDef } from "../../../shared/util";

export function genClassForVnode (vnode) {
    let data = vnode.data
     // TODO
    return renderClass(data.staticClass, data.class)
}

export function renderClass (staticClass, dynamicClass) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
        return concat(staticClass) // TODO
    }
    return ''
}

export function concat (a, b) {
    return a ? b ? (a + ' ' + b) : a : (b || '')
}
