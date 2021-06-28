export function createCompileToFunctionFn (compile) {
    return function compileToFunctions (template, options, vm) {
        compile()
        console.log('gsdcompileToFunctions')
        const res = {}
        res.render = {}
        res.render = function(createElement) {
            return createElement('div', [createElement('h1', 'aaa111')])
        }
        res.staticRenderFns = {} // TODO
        return res
    }
}
