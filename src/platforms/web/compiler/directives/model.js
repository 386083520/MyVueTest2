import { addProp } from "../../../../compiler/helpers";

export default function model (el, dir, _warn) {
    const tag = el.tag
    const value = dir.value
    const modifiers = dir.modifiers
    if (el.component) {
        // TODO
    } else if(false) { // TODO
    } else if (tag === 'input' || tag === 'textarea') {
        genDefaultModel(el, value, modifiers)
    } else if (false) { // TODO
    }
    return true
}

function genDefaultModel (el,value,modifiers) {
    addProp(el, 'value', `(${value})`)
}
