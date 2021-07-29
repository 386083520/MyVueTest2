import { parseHTML } from "./html-parser";
import {baseWarn} from "../helpers";

export let warn
export function createASTElement (tag, attrs, parent) {
    return {
        type: 1,
        tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        rawAttrsMap: {},
        parent,
        children: []
    }
}
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
            let element = createASTElement(tag, attrs, currentParent)
            if (!root) {
                root = element
            }
            if (!unary) {
                currentParent = element
            }
        },
        end (tag, start, end) {},
        chars (text, start, end) {
            const children = currentParent.children
            if (text) {
                let child
                if (false) { // TODO

                }else if(text !== ' ' || !children.length) { // TODO
                    child = {
                        type: 3,
                        text
                    }
                }
                if (child) {
                    if (options.outputSourceRange) {
                        child.start = start
                        child.end = end
                    }
                    children.push(child)
                }
            }
        },
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

function makeAttrsMap(attrs) {
    const map = {}
    return attrs
}
