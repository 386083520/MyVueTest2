import {noop} from "../shared/util";
import {extend} from "../shared/util";
import {warn as baseWarn, tip} from "../core/util/index";
import {generateCodeFrame} from "./codeframe";

function createFunction (code, errors) {
    try {
        return new Function(code)
    } catch (err) {
        errors.push({ err, code })
        return noop
    }
}

export function createCompileToFunctionFn (compile) {
    const cache = Object.create(null)
    return function compileToFunctions (template, options, vm) {
        options = extend({}, options)
        const warn = options.warn || baseWarn
        delete options.warn
        if (true) { // TODO
            try {
                new Function('return 1') // 是否允许将字符串当作代码执行
            } catch (e) {
                if (e.toString().match(/unsafe-eval|CSP/)) {
                    warn(
                        'It seems you are using the standalone build of Vue.js in an ' +
                        'environment with Content Security Policy that prohibits unsafe-eval. ' +
                        'The template compiler cannot work in this environment. Consider ' +
                        'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                        'templates into render functions.'
                    )
                }
            }
        }
        const key = options.delimiters? String(options.delimiters) + template: template //生成key
        if (cache[key]) {
            return cache[key]
        }
        const compiled = compile(template, options)
        compiled.tips = [{
            msg: '构建成功'
        }]
        if (true) { // TODO
            if (compiled.errors && compiled.errors.length) { // 编译失败的时候给出错误提示
                if (options.outputSourceRange) {
                    compiled.errors.forEach(e => {
                        warn(`Error compiling template:\n\n${e.msg}\n\n` +
                            generateCodeFrame(template, e.start, e.end)
                            ,vm)
                    })
                } else {
                    warn(`Error compiling template:\n\n${template}\n\n` +
                        compiled.errors.map(e => `- ${e}`).join('\n') + '\n'
                        , vm)
                }
            }
            if (compiled.tips && compiled.tips.length) {
                if (options.outputSourceRange) {
                    compiled.tips.forEach(e => tip(e.msg, vm))
                } else {
                    compiled.tips.forEach(msg => tip(msg, vm))
                }
            }
        }
        console.log('gsdcompileToFunctions')
        const res = {}
        const fnGenErrors = []
        res.render = createFunction(compiled.render, fnGenErrors)
        res.staticRenderFns = compiled.staticRenderFns.map(code => {
            return createFunction(code, fnGenErrors)
        })
        if (true) { // TODO
            if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
                warn(
                    `Failed to generate render function:\n\n` +
                    fnGenErrors.map(({ err, code }) => `${err.toString()} in\n\n${code}\n`).join('\n'),
                    vm
                )
            }
        }
        return (cache[key] = res)
    }
}
