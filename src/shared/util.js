const _toString = Object.prototype.toString

export const emptyObject = Object.freeze({}) // object.freeze() 方法可以冻结一个对象

export function noop (a, b, c) {
}

export function isUndef(v) {
    return v === undefined || v === null
}

export function isDef (v) {
    return v !== undefined && v !== null
}

export function isPrimitive (value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        // $flow-disable-line
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

export function isTrue (v) {
    return v === true
}

/*export const no = (a, b, c) => {
    return (a === 'div' || a === 'h1')
}*/ // TODO
export const no = (a, b, c) => false

export const identity = (_) => _

const hasOwnProperty = Object.prototype.hasOwnProperty // 指示对象自身属性中是否具有指定的属性
export function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
}
export function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

export function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
}

export function toString (val) {
    return val == null? '': String(val)
}

export function makeMap (str, expectsLowerCase) {
    const map = Object.create(null)
    const list = str.split(',')
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true
    }
    return expectsLowerCase
        ? val => map[val.toLowerCase()]
        : val => map[val]
}

export function cached (fn) { // 一个高阶函数，避免fn被重复的执行，减少时间损耗
    const cache = Object.create(null)
    return (function cachedFn (str) {
        const hit = cache[str]
        return hit || (cache[str] = fn(str))
    })
}

export function extend (to, _from) { // 合并，以from的优先级更高
    for (const key in _from) {
        to[key] = _from[key]
    }
    return to
}

export function remove (arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}

const camelizeRE = /-(\w)/g // 0-9 a-z A-Z _
export const camelize = cached((str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})



