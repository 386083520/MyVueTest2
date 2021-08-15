import { toString } from "../../../shared/util";
import { createTextVNode, createEmptyVNode } from "../../vdom/VNode";
import { renderStatic } from "./render-static";

export function installRenderHelpers (target) {
    target._v = createTextVNode
    target._s = toString
    target._m = renderStatic
    target._e = createEmptyVNode
}
