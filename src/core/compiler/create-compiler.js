import { createCompileToFunctionFn } from "./to-function"

export function createCompilerCreator (baseCompile) {
    return function createCompiler (baseOptions) {
        function compile (template, options) {
        }
        return {
            compile,
            compileToFunctions: createCompileToFunctionFn(compile)
        }
    }
}
