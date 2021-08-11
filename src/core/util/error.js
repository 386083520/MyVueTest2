export function invokeWithErrorHandling (handler, context, args, vm, info) {
    let res
    res = args ? handler.apply(context, args) : handler.call(context)
    return res
}
