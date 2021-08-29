import { isUndef } from "../../../../shared/util";

function updateDOMProps (oldVnode, vnode) {
    console.log('gsdupdateDOMProps')
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
        return
    }
    var key, cur;
    const elm = vnode.elm
    const oldProps = oldVnode.data.domProps || {}
    let props = vnode.data.domProps || {}
    for (key in oldProps) {
        // TODO
    }
    for (key in props) {
        cur = props[key];
        if (key === 'value' && elm.tagName !== 'PROGRESS') {
            elm._value = cur;
            var strCur = isUndef(cur) ? '' : String(cur);
            if (shouldUpdateValue(elm, strCur)) {
                elm.value = strCur;
            }
        }
    }
}

function shouldUpdateValue (elm, checkVal) {
    return true
}
export default {
    create: updateDOMProps,
    update: updateDOMProps
}
