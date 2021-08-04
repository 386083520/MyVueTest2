import { isNative } from "./env";

export let isUsingMicroTask = false
const callbacks = []
let pending = false
let timerFunc

function flushCallbacks () {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
        copies[i]()
    }
}
if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve()
    timerFunc = () => {
        console.log('gsdtimerFunc')
        p.then(flushCallbacks)
    }
    isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    timerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else {
    timerFunc = () => {
        setTimeout(flushCallbacks, 0)
    }
}
console.log('timerFunc', timerFunc)
export function nextTick (cb, ctx) { // TODO
    callbacks.push(() => {
        try {
            cb.call(ctx)
        } catch (e) {
            // TODO
        }
    })
    if (!pending) {
        pending = true
        // 启动异步函数
        console.log('gsdtimerFunc2')
        timerFunc()
    }
    console.log('callbacks', callbacks.length)
}
