import { createCompileToFunctionFn } from "./to-function"

export function createCompilerCreator (baseCompile) {
    return function createCompiler (baseOptions) {
        function compile (template, options) {
            const finalOptions = Object.create(baseOptions)
            if (options) {
                for (var key in options) {
                    if (key !== 'modules' && key !== 'directives') {
                        finalOptions[key] = options[key];
                    }
                }
            }
            const compiled = baseCompile(template.trim(), finalOptions)
            return compiled
        }
        return {
            compile,
            compileToFunctions: createCompileToFunctionFn(compile)
        }
    }
}
