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

