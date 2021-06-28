import { createCompiler } from "../../../core/compiler/index"
import { baseOptions } from "../../../core/compiler/options";

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
