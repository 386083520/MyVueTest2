import { parseHTML } from "./html-parser";
import {baseWarn} from "../helpers";
import { pluckModuleFunction } from "../helpers";
import { parseText } from "./text-parser";
import {no} from "../../shared/util";
import { isIE, isEdge, isServerRendering } from "../../core/util/index";
import { getAndRemoveAttr } from "../helpers";

export let warn

let transforms
let preTransforms
let postTransforms
let delimiters

let platformIsPreTag
let platformMustUseProp
let platformGetTagNamespace
let maybeComponent

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
function isForbiddenTag (el) { // 是否是一些禁止的tag
    return (
        el.tag === 'style' ||
        (el.tag === 'script' && (
            !el.attrsMap.type ||
            el.attrsMap.type === 'text/javascript'
        ))
    )
}
export function parse (template, options) {
    warn = options.warn || baseWarn

    platformIsPreTag = options.isPreTag || no // 判断是否是pre标签

    platformMustUseProp = options.mustUseProp || no
    platformGetTagNamespace = options.getTagNamespace || no
    const isReservedTag = options.isReservedTag || no
    maybeComponent = (el) => !!el.component || !isReservedTag(el.tag)
    transforms = pluckModuleFunction(options.modules, 'transformNode')
    preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
    postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')

    delimiters = options.delimiters

    const stack = []
    const preserveWhitespace = options.preserveWhitespace !== false // 去掉空格
    const whitespaceOption = options.whitespace
    let root
    let currentParent
    let inVPre = false // 是否标记了v-pre v-pre用于跳过这个元素和它子元素的编译过程，用于显示原本的Mustache语法
    let inPre = false
    let warned = false

    function warnOnce (msg, range) { // 多次只警告一次
        if (!warned) {
            warned = true
            warn(msg, range)
        }
    }


    function closeElement (element) {// 关闭element
        if (!inVPre && !element.processed) {
            element = processElement(element, options)
        }
    }

    function trimEndingWhitespace (el) { // 若当前元素不是pre元素，则删除元素尾部的空白文本节点

    }

    function checkRootConstraints (el) { // 校验检查，不要用slot、template做根节点，也不要用 v-for 属性，因为这些都可能产生多个根节点

    }
    parseHTML(template, {
        warn, // 警告函数
        expectHTML: options.expectHTML,
        isUnaryTag: options.isUnaryTag, // 是否是一元标签
        canBeLeftOpenTag: options.canBeLeftOpenTag,
        shouldDecodeNewlines: options.shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
        shouldKeepComment: options.comments, // 是否保存注释
        outputSourceRange: options.outputSourceRange,
        start (tag, attrs, unary, start, end) {
            const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag) // 获取标签名的命名空间,如果currentParent有命名空间 继承父ns
            if (isIE && ns === 'svg') { // 在IE浏览器下处理svg bug
                attrs = guardIESVGBug(attrs)
            }
            let element = createASTElement(tag, attrs, currentParent)
            if (ns) {
                element.ns = ns
            }
            if (true) { // TODO

            }
            if (isForbiddenTag(element) && !isServerRendering()) { // 判断生成的element是否是禁止标签
                element.forbidden = true
                warn(
                    'Templates should only be responsible for mapping the state to the ' +
                    'UI. Avoid placing tags with side-effects in your templates, such as ' +
                    `<${tag}>` + ', as they will not be parsed.',
                    { start: element.start }
                )
            }
            // 根据preTransforms处理element
            for (let i = 0; i < preTransforms.length; i++) {
                element = preTransforms[i](element, options) || element
            }
            if (!inVPre) { // 如果没有标记v-pre
                processPre(element)
                if (element.pre) {
                    inVPre = true
                }
            }
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
        if (
            map[attrs[i].name] && !isIE && !isEdge
        ) {
            warn('duplicate attribute: ' + attrs[i].name, attrs[i])
        }
        map[attrs[i].name] = attrs[i].value
    }
    return map
}

function guardIESVGBug (attrs) { // 处理IE svg的bug
    return attrs
}

function processPre (el) {
    if (getAndRemoveAttr(el, 'v-pre') != null) {
        el.pre = true
    }
}
