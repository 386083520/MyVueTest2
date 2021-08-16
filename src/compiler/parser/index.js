//import he from 'he'
import { parseHTML } from "./html-parser";
import { pluckModuleFunction, baseWarn, addDirective } from "../helpers";
import { parseText } from "./text-parser";
import {no, cached} from "../../shared/util";
import { isIE, isEdge, isServerRendering } from "../../core/util/index";
import { getAndRemoveAttr, getBindingAttr, addAttr, getRawBindingAttr } from "../helpers";

export const dirRE = /^v-|^@|^:|^\.|^#/ //一些常用指令 // TODO
export const bindRE = /^:|^\.|^v-bind:/ // bind的常见写法 :aaa .aaa v-bind:aaa   :class='aaa'
export const onRE = /^@|^v-on:/ // 绑定事件的常见写法  @click v-on:click
const argRE = /:(.*)$/

const invalidAttributeRE = /[\s"'<>\/=]/
const lineBreakRE = /[\r\n]/ // 回车换行
const whitespaceRE = /\s+/g // 全局匹配空格

// const decodeHTMLCached = cached(he.decode)
const decodeHTMLCached = function (text) { // TODO
    return text
}
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
    processKey(element)
    element.plain = (
        !element.key &&
        !element.scopedSlots &&
        !element.attrsList.length
    )
    processRef(element)
    processSlotContent(element)
    processSlotOutlet(element)
    processComponent(element)
    for (let i = 0; i < transforms.length; i++) { // 根据transforms处理element,在closeElement里面调用的
        element = transforms[i](element, options) || element
    }
    processAttrs(element)
    return element
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
    const preserveWhitespace = options.preserveWhitespace !== false // 保留空格
    const whitespaceOption = options.whitespace
    let root
    let currentParent // 当前的父节点
    let inVPre = false // 是否标记了v-pre v-pre用于跳过这个元素和它子元素的编译过程，用于显示原本的Mustache语法
    let inPre = false
    let warned = false

    function warnOnce (msg, range) { // 多次只警告一次
        if (!warned) {
            warned = true
            warn(msg, range)
        }
    }


    function closeElement (element) {// 关闭element // TODO
        trimEndingWhitespace(element)
        if (!inVPre && !element.processed) {
            element = processElement(element, options)
        }
        if (!stack.length && element !== root) { // 判断当前是否只有一个根节点
            if (root.if && (element.elseif || element.else)) {
                if (true) {
                    checkRootConstraints(element)
                }
                addIfCondition(root, { // TODO
                    exp: element.elseif,
                    block: element
                })
            } else if (true) { // TODO
                warnOnce(
                    `Component template should contain exactly one root element. ` +
                    `If you are using v-if on multiple elements, ` +
                    `use v-else-if to chain them instead.`,
                    { start: element.start }
                )
            }
        }
        if (currentParent && !element.forbidden) {
            if (element.elseif || element.else) {
                processIfConditions(element, currentParent)
            } else {
                if (element.slotScope) {
                    const name = element.slotTarget || '"default"'
                    ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
                }
                currentParent.children.push(element)
                element.parent = currentParent
            }
        }
        element.children = element.children.filter(c => !c.slotScope) // 对children进行过滤，过滤掉包含slotScope
        trimEndingWhitespace(element)
        if (element.pre) {
            inVPre = false
        }
        if (platformIsPreTag(element.tag)) {
            inPre = false
        }
        for (let i = 0; i < postTransforms.length; i++) {
            postTransforms[i](element, options)
        }
    }

    function trimEndingWhitespace (el) { // 若当前元素不是pre元素，则删除元素尾部的空白文本节点
        if (!inPre) { // 如果不是pre标签
            let lastNode
            while ((lastNode = el.children[el.children.length - 1]) && lastNode.type === 3 && lastNode.text === ' ') {
                el.children.pop()
            }
        }
    }

    function checkRootConstraints (el) { // 校验检查，不要用slot、template做根节点，也不要用 v-for 属性，因为这些都可能产生多个根节点
        if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
                `Cannot use <${el.tag}> as component root element because it may ` +
                'contain multiple nodes.',
                { start: el.start }
            )
        }
        if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
                'Cannot use v-for on stateful component root element because ' +
                'it renders multiple elements.',
                el.rawAttrsMap['v-for']
            )
        }
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
                if (options.outputSourceRange) {
                    element.start = start
                    element.end = end
                    element.rawAttrsMap = element.attrsList.reduce((cumulated, attr) => {
                        cumulated[attr.name] = attr
                        return cumulated
                    }, {})
                }
                attrs.forEach(attr => {
                    if (invalidAttributeRE.test(attr.name)) {
                        warn(
                            `Invalid dynamic argument expression: attribute names cannot contain ` +
                            `spaces, quotes, <, >, / or =.`,
                            {
                                start: attr.start + attr.name.indexOf(`[`),
                                end: attr.start + attr.name.length
                            }
                        )
                    }
                })
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
            if (platformIsPreTag(element.tag)) { // pre 元素可定义预格式化的文本。被包围在 pre 元素中的文本通常会保留空格和换行符
                inPre = true
            }
            if (inVPre) {
                processRawAttrs(element)
            }else if(!element.processed){ // 没有v-pre 并且没有processed
                processFor(element) // v-for
                processIf(element) // v-if
                processOnce(element) // v-once
            }
            if (!root) {
                root = element
                if (true) { // TODO
                    checkRootConstraints(root)
                }
            }
            if (!unary) {
                currentParent = element
                stack.push(element)
            }else{
                closeElement(element)
            }
        },
        end (tag, start, end) {
            const element = stack[stack.length - 1]
            stack.length -= 1
               // <div class='a'><div class='b'>fdasfdas</div></div>
            currentParent = stack[stack.length - 1];
            if (options.outputSourceRange) {
                element.end = end
            }
            closeElement(element)
            console.log('gsdelement', element)
        },
        chars (text, start, end) {
            if (!currentParent) {
                if (true) { // TODO
                    if (text === template) {
                        warnOnce(
                            'Component template requires a root element, rather than just text.',
                            { start }
                        )
                    }else if((text = text.trim())) {
                        warnOnce(
                            `text "${text}" outside root element will be ignored.`,
                            { start }
                        )
                    }
                }
                return
            }
            if (isIE && // 解决IE的bug 由于placeholder是 html5的新属性，可想而知，仅支持html5的浏览器才支持placeholder，目前最新的firefox、chrome、safari以及ie10都支持，ie6到ie9都不支持。
                currentParent.tag === 'textarea' &&
                currentParent.attrsMap.placeholder === text
            ) {
                return
            }
            const children = currentParent.children
            if (inPre || text.trim()) { // 是pre或者text不为空
                text = isTextTag(currentParent) ? text: decodeHTMLCached(text)
            } else if (!children.length) {
                text = ''
            } else if (whitespaceOption) {
                if (whitespaceOption === 'condense') {
                    text = lineBreakRE.test(text) ? '' : ' '
                } else {
                    text = ' '
                }
            } else {
                text = preserveWhitespace ? ' ' : ''
            }
            if (text) {
                if (!inPre && whitespaceOption === 'condense') {
                    text = text.replace(whitespaceRE, ' ')
                }
                let res
                let child
                // 不是--vpre 并且text不为空并且parseText有结果
                if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) { // TODO
                    console.log('gsdres', res)
                    child = { // 表达式类型的
                        type: 2,
                        expression: res.expression,
                        tokens: res.tokens,
                        text
                    }
                }else if(text !== ' ' || !children.length || children[children.length - 1].text !== ' ') { //text不为空或者children为空或者。。。     // TODO
                    child = { // 普通的文本节点
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
        comment (text, start, end) { // 对一些注释的处理
            if (currentParent) {
                const child = { // 注释
                    type: 3,
                    text,
                    isComment: true
                }
                if (options.outputSourceRange) {
                    child.start = start
                    child.end = end
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

function processRawAttrs (el) { // 存在v-pre的时候，遍历当前所有的attrsList，依次保存到e.attrs上面
    const list = el.attrsList
    const len = list.length
    if (len) {
        const attrs = el.attrs = new Array(len)
        for (let i = 0; i < len; i++) {
            attrs[i] = {
                name: list[i].name,
                value: JSON.stringify(list[i].value)
            }
            if (list[i].start != null) {
                attrs[i].start = list[i].start
                attrs[i].end = list[i].end
            }
        }
    } else if (!el.pre) { // TODO

    }
}

export function processFor (el) { // 处理v-for
    let exp
    if ((exp = getAndRemoveAttr(el, 'v-for'))) {
        const res = parseFor(exp)
        if (res) {

        }else{ // TODO
            warn(
                `Invalid v-for expression: ${exp}`,
                el.rawAttrsMap['v-for']
            )
        }
    }
}

function processIf (el) {
    const exp = getAndRemoveAttr(el, 'v-if')
    if (exp) {
        el.if = exp
        addIfCondition(el, {
            exp: exp,
            block: el
        })
    } else {
        if (getAndRemoveAttr(el, 'v-else') != null) {
            el.else = true
        }
        const elseif = getAndRemoveAttr(el, 'v-else-if')
        if (elseif) {
            el.elseif = elseif
        }
    }
}

function processOnce (el) {
    const once = getAndRemoveAttr(el, 'v-once')
    if (once != null) {
        el.once = true //子组件中分别加入v-once，当每次切换组件效果时，不再需要每次都经过 创建——销毁 的过程，而是在内存中直接取用上一次使用过的组件的内容，可有效提高静态内容的展示效率
    }
}

export function parseFor (exp) {
    return exp
}

export function addIfCondition (el, condition) {
    if (!el.ifConditions) {
        el.ifConditions = []
    }
    el.ifConditions.push(condition)
}

function isTextTag (el) {
    return el.tag === 'script' || el.tag === 'style'
}

function processKey (el) {

}

function processRef(el) {

}

function processSlotContent(el) {
    let slotScope
    if (el.tag === 'template') {
        slotScope = getAndRemoveAttr(el, 'scope')
        if (slotScope) {
            warn(
                `the "scope" attribute for scoped slots have been deprecated and ` +
                `replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ` +
                `can also be used on plain elements in addition to <template> to ` +
                `denote scoped slots.`,
                el.rawAttrsMap['scope'],
                true
            )
        }
        el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
        if (el.attrsMap['v-for']) {
            warn(
                `Ambiguous combined usage of slot-scope and v-for on <${el.tag}> ` +
                `(v-for takes higher priority). Use a wrapper <template> for the ` +
                `scoped slot to make it clearer.`,
                el.rawAttrsMap['slot-scope'],
                true
            )
        }
        el.slotScope = slotScope
    }
    const slotTarget = getBindingAttr(el, 'slot')
    if (slotTarget) {
        el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget
        el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot'])
        if (el.tag !== 'template' && !el.slotScope) {
            addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'))
        }
    }
    if (true) { // TODO
    }
}

function processSlotOutlet(el) {

}

function processComponent(el) {

}

function processAttrs(el) {
    const list = el.attrsList
    let i,l, name, rawName, value, isDynamic, modifiers
    for (i = 0, l = list.length; i < l; i++) {
        name = rawName = list[i].name
        value = list[i].value
        if (dirRE.test(name)) {// 对指令的处理
            // TODO
            el.hasBindings = true // 只要attrsList里面的name是指令 则将hasBindings变为true
            if (bindRE.test(name)) { // v-bind

            } else if (onRE.test(name)) { // v-on

            } else { // normal directives
                name = name.replace(dirRE, '') // v-show -> show
                const argMatch = name.match(argRE) // 匹配:XXX
                let arg = argMatch && argMatch[1]
                isDynamic = false // TODO
                if (arg) {
                    // TODO
                }
                addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i])
                if( true && name === 'model') { // TODO
                    checkForAliasModel(el, value)
                }

            }
        } else {// 常见的attrs
            addAttr(el, name, JSON.stringify(value), list[i])
        }
    }
}

function checkForAliasModel (el, value) {

}

function processIfConditions (el, parent) { // elseif 和else的时候触发
    const prev = findPrevElement(parent.children)
    if (prev && prev.if) {
        addIfCondition(prev, { // TODO
            exp: el.elseif,
            block: el
        })
    } else if (true) { // TODO
        warn(
            `v-${el.elseif ? ('else-if="' + el.elseif + '"') : 'else'} ` +
            `used on element <${el.tag}> without corresponding v-if.`,
            el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']
        )
    }
}

function findPrevElement (children) { // 找到上一个元素
    let i = children.length
    while (i--) {
        if (children[i].type === 1) {
            return children[i]
        } else {
            if (children[i].text !== ' ') {
                warn(
                    `text "${children[i].text.trim()}" between v-if and v-else(-if) ` +
                    `will be ignored.`,
                    children[i]
                )
                children.pop()
            }
        }
    }
}
