import { createPatchFunction } from "../../../core/vdom/patch"
import * as nodeOps from './node-ops'
const modules = ''
export const patch = createPatchFunction({nodeOps, modules})
