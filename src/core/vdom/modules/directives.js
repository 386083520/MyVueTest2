import {emptyNode} from "../patch";
import { resolveAsset } from "../../util/index";

export default {
    create: updateDirectives,
    update: updateDirectives
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
    console.log('gsdnewDirs', newDirs)
    let key, oldDir, dir
    for (key in newDirs) {
        oldDir = oldDirs[key]
        dir = newDirs[key]
        if (!oldDir) {
            callHook(dir, 'bind', vnode, oldVnode)
            if (dir.def && dir.def.inserted) {
                // TODO
            }
        } else {
            dir.oldValue = oldDir.value
            dir.oldArg = oldDir.arg
            callHook(dir, 'update', vnode, oldVnode)
            if (dir.def && dir.def.componentUpdated) {
                // TODO
            }
        }
    }
}

const emptyModifiers = Object.create(null)

function normalizeDirectives (dirs, vm) {
    const res = Object.create(null)
    if (!dirs) {
        return res
    }
    let i, dir
    for (i = 0; i < dirs.length; i++) {
        dir = dirs[i]
        if (!dir.modifiers) {
            dir.modifiers = emptyModifiers
        }
        res[getRawDirName(dir)] = dir
        dir.def = resolveAsset(vm.$options, 'directives', dir.name, true)
    }
    return res
}

function getRawDirName (dir) {
    return dir.rawName // TODO
}

function callHook (dir, hook, vnode, oldVnode, isDestroy) {
    const fn = dir.def && dir.def[hook]
    if (fn) {
        try {
            fn(vnode.elm, dir, vnode, oldVnode, isDestroy)
        } catch (e) {
            // TODO
        }
    }
}
