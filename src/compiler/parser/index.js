import { parseHTML } from "./html-parser";

export function parse (template, options) {
    let root
    let currentParent
    parseHTML(template, {
        shouldKeepComment: options.comments,
        start (tag, attrs, unary, start, end) {},
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
