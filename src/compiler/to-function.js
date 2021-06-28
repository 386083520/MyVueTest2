function createFunction (code, errors) {

}

export function createCompileToFunctionFn (compile) {
    return function compileToFunctions (template, options, vm) {
        const compiled = compile(template, options)
        console.log('gsdcompileToFunctions')
        const res = {}
        const fnGenErrors = []
        res.render = createFunction(compiled.render, fnGenErrors)
        /*res.render = function(createElement) {
            return createElement('div', [createElement('h1', 'aaa111')])
        }*/
        res.staticRenderFns = {} // TODO
        return res
    }
}
