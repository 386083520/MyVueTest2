import { toString } from "../../../shared/util";
import { createTextVNode } from "../../vdom/VNode";

export function installRenderHelpers (target) {
    target._v = createTextVNode
    target._s = toString
}
