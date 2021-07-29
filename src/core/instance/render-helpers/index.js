import { createTextVNode } from "../../vdom/VNode";

export function installRenderHelpers (target) {
    target._v = createTextVNode
}
