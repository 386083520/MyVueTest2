import { parseHTML } from "./html-parser";
import {baseWarn} from "../helpers";
import { pluckModuleFunction } from "../helpers";
import { parseText } from "./text-parser";

export let warn

let transforms
let delimiters

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
export function processElement (element, options) {
    for (let i = 0; i < transforms.length; i++) {
        element = transforms[i](element, options) || element
    }
}
export function parse (template, options) {
    delimiters = options.delimiters
    let root
    let currentParent
    let inVPre = false
    const stack = []
    warn = options.warn || baseWarn
    transforms = pluckModuleFunction(options.modules, 'transformNode')
    function closeElement (element) {
        if (!inVPre && !element.processed) {
            element = processElement(element, options)
        }
    }
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
                stack.push(element)
            }
        },
        end (tag, start, end) {
            const element = stack[stack.length - 1]
            stack.length -= 1
            closeElement(element)
        },
        chars (text, start, end) {
            const children = currentParent.children
            if (text) {
                let res
                let child
                if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) { // TODO
                    console.log('gsdres', res)
                    child = {
                        type: 2,
                        expression: res.expression,
                        tokens: res.tokens,
                        text
                    }
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
    for (let i = 0, l = attrs.length; i < l; i++) {
        map[attrs[i].name] = attrs[i].value
    }
    return map
}
