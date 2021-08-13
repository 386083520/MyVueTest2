import { genClassForVnode } from "../../util/index";

function updateClass (oldVnode, vnode) {
    console.log('gsdupdateClass')
    const el = vnode.elm
    const data = vnode.data
    const oldData = oldVnode.data
    // TODO
    let cls = genClassForVnode(vnode)
    if (cls !== el._prevClass) {
        el.setAttribute('class', cls)
        el._prevClass = cls
    }
}


export default {
    create: updateClass,
    update: updateClass
}
