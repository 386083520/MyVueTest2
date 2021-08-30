export function genHandlers (events,isNative) {
    const prefix = isNative ? 'nativeOn:' : 'on:'
    let staticHandlers = ``
    let dynamicHandlers = ``
    for (const name in events) {
        const handlerCode = genHandler(events[name])
        if (events[name] && events[name].dynamic) {

        } else {
            staticHandlers += `"${name}":${handlerCode},`
        }
    }
    staticHandlers = `{${staticHandlers.slice(0, -1)}}`
    if (dynamicHandlers) {
    } else {
        return prefix + staticHandlers
    }
}
function genHandler (handler) {
    if (!handler) {
        return 'function(){}'
    }
    if (Array.isArray(handler)) {
        // TODO
    }
    if (!handler.modifiers) {
        return handler.value // TODO
    }
}

