export const inBrowser = typeof window !== 'undefined'
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isIE = UA && /msie|trident/.test(UA)
export const isEdge = UA && UA.indexOf('edge/') > 0

export const nativeWatch = ({}).watch // firefox 浏览器自带的有watch方法

export function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

let _isServer
export const isServerRendering = () => {
    _isServer = false // TODO
    return _isServer
}
