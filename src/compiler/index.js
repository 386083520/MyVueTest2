import { createCompilerCreator } from "./create-compiler";
import { parse } from "./parser/index";
import { generate } from "./codegen/index";
import { optimize } from "./optimizer";

export const createCompiler = createCompilerCreator(function baseCompile (template, options) {
    // 通过template拿到ast
    const ast = parse(template.trim(), options)
    console.log('gsdast', ast)
    // 静态化
    if (options.optimize !== false) { // TODO
        optimize(ast, options)
    }
    // AST转换为代码字符串'function(){}
    // 比如：with(this){return _c('div',{staticClass:"container"},[_v("\n        ")])}
    const code = generate(ast, options)
    console.log('gsdcode', code)
    return {
        ast,
        render: code.render,
        staticRenderFns: code.staticRenderFns
    }
})
