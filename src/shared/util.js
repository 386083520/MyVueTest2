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

export const no = (a, b, c) => false

export const identity = (_) => _

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
}
export function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}


