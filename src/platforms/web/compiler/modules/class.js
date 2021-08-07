import {getAndRemoveAttr} from "../../../../compiler/helpers";

function genData (el) {
    console.log('gsdel', el)
    let data = ''
    if (el.staticClass) {
        data += `staticClass:${el.staticClass},`
    }
    return data
}

function transformNode (el, options) {
    const staticClass = getAndRemoveAttr(el, 'class')
    console.log('gsdstaticClass', staticClass)
    if (staticClass) {
        el.staticClass = JSON.stringify(staticClass)
    }
}

export default {
    transformNode,
    genData
}
