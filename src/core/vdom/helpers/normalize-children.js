import {isPrimitive} from "../../../shared/util"
import {createTextVNode} from "../VNode"

export function normalizeChildren (children) {
    return isPrimitive(children) ? [createTextVNode(children)]: (Array.isArray(children) ? normalizeArrayChildren(children): undefined)
}

function normalizeArrayChildren (children) {
    const res = []
    let i, c
    for (i = 0; i < children.length; i++) {
        c = children[i]
        if (Array.isArray(c)) {

        }else if(isPrimitive(c)) {

        } else {
            res.push(c)
        }
    }
    console.log('res', res)
    return res
}
