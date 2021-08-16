import { parseFilters } from "./parser/filter-parser";

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

export function getBindingAttr (el, name, getStatic) {
    const dynamicValue =
        getAndRemoveAttr(el, ':' + name) ||
        getAndRemoveAttr(el, 'v-bind:' + name)
    if (dynamicValue != null) {
        return parseFilters(dynamicValue)
    } else if (getStatic !== false) {
        const staticValue = getAndRemoveAttr(el, name)
        if (staticValue != null) {
            return JSON.stringify(staticValue)
        }
    }
}

export function addAttr (el, name, value, range, dynamic) {
    // attrs后面会在生产render函数的时候用到
    const attrs = dynamic? (el.dynamicAttrs || (el.dynamicAttrs = [])): (el.attrs || (el.attrs = []))
    attrs.push(rangeSetItem({ name, value, dynamic }, range))
    el.plain = false
}

function rangeSetItem (item, range) {
    if (range) {
        if (range.start != null) {
            item.start = range.start
        }
        if (range.end != null) {
            item.end = range.end
        }
    }
    return item
}

export function getRawBindingAttr (el, name){ // 从rawAttrsMap去取name的值
    return el.rawAttrsMap[':' + name] ||
        el.rawAttrsMap['v-bind:' + name] ||
        el.rawAttrsMap[name]
}
export function addDirective (el, name, rawName, value, arg, isDynamicArg, modifiers, range) {
    (el.directives || (el.directives = [])).push(rangeSetItem({
        name,
        rawName,
        value,
        arg,
        isDynamicArg,
        modifiers
    }, range))
    el.plain = false
}


