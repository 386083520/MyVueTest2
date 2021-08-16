import {emptyNode} from "../patch";

export default {
    create: updateDirectives
}

function updateDirectives (oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
        _update(oldVnode, vnode)
    }
}

function _update (oldVnode, vnode) {
    const isCreate = oldVnode === emptyNode
    const isDestroy = vnode === emptyNode
    const oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context)
    const newDirs = normalizeDirectives(vnode.data.directives, vnode.context)
    let key, oldDir, dir
    for (key in newDirs) {
        oldDir = oldDirs[key]
        dir = newDirs[key]
        if (!oldDir) {
        } else {
        }
    }
}

function normalizeDirectives (dirs, vm) {
    return dirs // TODO
}
