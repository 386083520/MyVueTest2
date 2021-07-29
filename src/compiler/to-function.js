function createFunction (code, errors) {
    try {
        return new Function(code)
    } catch (err) {
    }
}

export function createCompileToFunctionFn (compile) {
    return function compileToFunctions (template, options, vm) {
        const compiled = compile(template, options)
        console.log('gsdcompileToFunctions')
        const res = {}
        const fnGenErrors = []
        res.render = createFunction(compiled.render, fnGenErrors)
        res.staticRenderFns = {} // TODO
        return res
    }
}
