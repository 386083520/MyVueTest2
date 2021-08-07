export function baseWarn (msg, range) {
    console.error(`[Vue compiler]: ${msg}`)
}
export function pluckModuleFunction(modules, key) {
    return modules
        ? modules.map(m => m[key]).filter(_ => _)
        : []
}

export function getAndRemoveAttr (el,name, removeFromMap) { // 获取并删除attr
    let val
    if ((val = el.attrsMap[name]) != null) {
        const list = el.attrsList
        for (let i = 0, l = list.length; i < l; i++) {
            if (list[i].name === name) {
                list.splice(i, 1)
                break
            }
        }
        if (removeFromMap) {
            delete el.attrsMap[name]
        }
    }
    return val
}
