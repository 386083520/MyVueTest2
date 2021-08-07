import { createCompileToFunctionFn } from "./to-function"
import { extend } from "../shared/util";
import { detectErrors } from "./error-detector";

export function createCompilerCreator (baseCompile) {
    return function createCompiler (baseOptions) {
        function compile (template, options) {
            // 合并baseOptions和options
            const finalOptions = Object.create(baseOptions)
            const errors = []
            const tips = []
            let warn = (msg, range, tip) => {
                (tip ? tips : errors).push(msg)
            }
            if (options) {
                if (options.outputSourceRange) {
                    const leadingSpaceLength = template.match(/^\s*/)[0].length
                    warn = (msg, range, tip) => {
                        const data = { msg }
                        if (range) {
                            if (range.start != null) {
                                data.start = range.start + leadingSpaceLength
                            }
                            if (range.end != null) {
                                data.end = range.end + leadingSpaceLength
                            }
                        }
                        (tip ? tips : errors).push(data)
                    }
                }
                // 合并modules
                if (options.modules) {
                    finalOptions.modules =
                        (baseOptions.modules || []).concat(options.modules)
                }
                // 合并directives
                if (options.directives) {
                    finalOptions.directives = extend(
                        Object.create(baseOptions.directives || null),
                        options.directives
                    )
                }
                for (var key in options) {
                    if (key !== 'modules' && key !== 'directives') {
                        finalOptions[key] = options[key];
                    }
                }
            }
            finalOptions.warn = warn
            // 执行baseCompile
            const compiled = baseCompile(template.trim(), finalOptions)
            detectErrors(compiled.ast, warn)
            compiled.errors = errors
            compiled.tips = tips
            return compiled
        }
        return {
            compile,
            compileToFunctions: createCompileToFunctionFn(compile)
        }
    }
}
