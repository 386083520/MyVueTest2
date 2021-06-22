import Vnode from './vnode'
import { isPrimitive, isTrue } from "../../shared/util";
import { normalizeChildren } from "./helpers/index"

const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

export function createElement (context, tag, data, children, normalizationType, alwaysNormalize) {
    if (Array.isArray(data) || isPrimitive(data)) {
        normalizationType = children
        children = data
        data = undefined
    }
    if (isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE
    }
    return _createElement(context, tag, data, children, normalizationType)
}

export function _createElement (context, tag, data, children, normalizationType) {
    if (normalizationType === ALWAYS_NORMALIZE) {
        children = normalizeChildren(children)
    } else if (normalizationType === SIMPLE_NORMALIZE) {

    }
    let vnode
    if (typeof tag === 'string') {
        // TODO
        vnode = new Vnode(
            tag, data, children,
            undefined, undefined, context
        )
    }
     // TODO
    return vnode
}
