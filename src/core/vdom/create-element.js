import VNode from './VNode'
import { isPrimitive, isTrue } from "../../shared/util";
import { normalizeChildren } from "./helpers/index"
import config from "../config"
import { isDef, resolveAsset } from "../util/index";
import { createComponent } from "./create-component";
import {isReservedTag} from "../../platforms/web/util/index";

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
        let Ctor
        config.isReservedTag = isReservedTag //TODO
        if (config.isReservedTag(tag)) {
            vnode = new VNode(
                config.parsePlatformTagName(tag), data, children,
                undefined, undefined, context
            )
        } else if ((!data) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
            console.log('Ctor', Ctor)
            vnode = createComponent(Ctor, data, context, children, tag)
        } else {
            vnode = new VNode(
                tag, data, children,
                undefined, undefined, context
            )
            console.log('gsdvnode1', vnode)
        }
    }
     // TODO
    return vnode
}
