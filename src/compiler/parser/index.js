import { parseHTML } from "./html-parser";
import {baseWarn} from "../helpers";

export let warn
export function parse (template, options) {
    let root
    let currentParent
    warn = options.warn || baseWarn
    parseHTML(template, {
        warn,
        expectHTML: options.expectHTML,
        isUnaryTag: options.isUnaryTag,
        shouldKeepComment: options.comments,
        start (tag, attrs, unary, start, end) {
        },
        end (tag, start, end) {},
        chars (text, start, end) {},
        comment (text, start, end) {
            if (currentParent) {
                const child = {
                    type: 3,
                    text,
                    isComment: true
                }
                currentParent.children.push(child)
            }
        }
    })
    return root
}
