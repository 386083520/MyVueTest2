import { createCompiler } from "../../../compiler/index"
import { baseOptions } from "../../../compiler/options";

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
