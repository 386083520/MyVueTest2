export const inBrowser = typeof window !== 'undefined'

export function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
