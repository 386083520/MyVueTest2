import { makeMap, no } from "../../shared/util";
import { unicodeRegExp } from "../../core/util/lang";
import {isNonPhrasingTag, canBeLeftOpenTag} from "../../platforms/web/compiler/util";

const comment = /^<!\--/
const conditionalComment = /^<!\[/
const doctype =/^<!DOCTYPE [^>]+>/i
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
export const isPlainTextElement = makeMap('script,style,textarea', true)

const reCache = {} // 缓存对象

const decodingMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&amp;': '&',
    '&#10;': '\n',
    '&#9;': '\t',
    '&#39;': "'"
}
const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g

const isIgnoreNewlineTag = makeMap('pre,textarea', true)
const shouldIgnoreFirstNewline = (tag, html) => tag && isIgnoreNewlineTag(tag) && html[0] === '\n'

function decodeAttr (value, shouldDecodeNewlines) {
    const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr
    return value.replace(re, match => decodingMap[match])
}

export function parseHTML (html, options) {
    const stack = []
    const expectHTML = options.expectHTML
    const isUnaryTag = options.isUnaryTag || no
    let index = 0
    let last,lastTag
    console.log('gsdhtml', html)
    while (html) {
        last = html  // 在处理之前存储原来的html的值
        if (!lastTag || !isPlainTextElement(lastTag)) { // lastTag没有，或者lastTag不是script,style,textarea
            console.log('gsdaaa', lastTag)
            let textEnd = html.indexOf('<') // 检索的<符号的位置
            if (textEnd === 0) { // <div></div>
                if (comment.test(html)) {// 检测html是不是注释
                    const commentEnd = html.indexOf('-->') // 找到注释的结尾
                    if (commentEnd >= 0) { // 如果注释有结尾
                        if (options.shouldKeepComment) { // 如果需要保存注释的话，调用comment方法
                            options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3)
                        }
                        advance(commentEnd + 3) // 跳过注释接着往下
                        continue
                    }
                }
                if (conditionalComment.test(html)) {  // 检测html是不是条件注释
                    const conditionalEnd = html.indexOf(']>') // 找到条件注释的结尾
                    if (conditionalEnd >= 0) {// 如果条件注释有结尾，跳过条件注释接着往下
                        advance(conditionalEnd + 2)
                        continue
                    }
                }
                const doctypeMatch = html.match(doctype) // 检测html是不是<!DOCTYPE...
                if (doctypeMatch) {  // 如果有<!DOCTYPE，跳过<!DOCTYPE接着往下
                    advance(doctypeMatch[0].length)
                    continue
                } // 匹配到<!DOCTYPE...后的逻辑处理
                const endTagMatch = html.match(endTag) // 匹配结束标签 />
                if (endTagMatch) { // 如果匹配到结束标签做的逻辑
                    console.log('gsdendTagMatch', endTagMatch)
                    const curIndex = index
                    advance(endTagMatch[0].length) // 调用了advance以后，index会指向一个新的开始的位置
                    parseEndTag(endTagMatch[1], curIndex, index) // 对结束标签里面的内容做具体的处理
                    continue
                }
                const startTagMatch = parseStartTag() // 匹配开始标签，返回一个处理过的match
                console.log(index, startTagMatch) // 匹配开始标签做的逻辑
                if (startTagMatch) {
                    handleStartTag(startTagMatch)
                    if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
                        advance(1)
                    }
                    continue
                }
            } // 检索的<符号的位置===0
            let text,rest,next
            if (textEnd >= 0) { // 检索的<符号的位置>=0
                rest = html.slice(textEnd)  // 从textEnd位置截取获得rest
                while ( // 如果<符号开头的不是endTag，startTagOpen，comment，conditionalComment
                    !endTag.test(rest) &&
                    !startTagOpen.test(rest) &&
                    !comment.test(rest) &&
                    !conditionalComment.test(rest)) {
                    next = rest.indexOf('<', 1)  // fdsafdsaf<fdsafdsa<div>
                    if (next < 0) break
                    textEnd += next
                    rest = html.slice(textEnd)
                }
                text = html.substring(0, textEnd)
            } // 检索的<符号的位置>=0
            if (textEnd < 0) { // 检索的<符号的位置没找到
                text = html
            }
            if (text) {
                advance(text.length)
            }
            if (options.chars && text) {
                options.chars(text, index - text.length, index)
            }
        } else {
            let endTagLength = 0
            const stackedTag = lastTag.toLowerCase()
            const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'))
            const rest = html.replace(reStackedTag, function (all, text, endTag) {
                console.log('gsdreStackedTag', reStackedTag, all ,text, endTag)
                // fdasfdasfad<textarea>abcd</textarea>fdsafdas
                // /([\s\S]*?)(<\/textarea[^>]*>)/i abcd</textarea> abcd </textarea>
                endTagLength = endTag.length
                if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
                    text = text
                        .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
                        .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1')
                }
                if (options.chars) {
                    options.chars(text)
                }
                return ''
            })
            console.log('gsdrest', rest) // fdsafdas
            index += html.length - rest.length
            html = rest
            parseEndTag(stackedTag, index - endTagLength, index)
        }
        if (html === last) {
            /*if (!stack.length && options.warn) {
                options.warn(`Mal-formatted tag at end of template: "${html}"`, { start: index + html.length })
            }*/
            break
        }
    }
    function parseStartTag () {
        const start = html.match(startTagOpen) // 匹配类似<div
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
                start: index
            }
            advance(start[0].length) // 跳过开始标签的位置
            let end, attr // <div class=''>
            while (!(end = html.match(startTagClose))  && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
                attr.start = index
                advance(attr[0].length)
                attr.end = index
                match.attrs.push(attr)
                console.log('gsdmatch', match)
            }
            if (end) { // <div> <div/>
                console.log('gsdend', end)
                match.unarySlash = end[1]
                advance(end[0].length)
                match.end = index
                return match
            }
        }
    }
    function advance (n) {
        index += n
        html = html.substring(n)
    }
    function handleStartTag (match) {
        const tagName = match.tagName // 标签名
        const unarySlash = match.unarySlash // 是不是单闭合
        if (expectHTML) {
            if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
                // <p><div></div></p>  -> <p></p><div></div><p></p>
                parseEndTag(lastTag)
            }
            if (canBeLeftOpenTag(tagName) && lastTag === tagName) { // <li><li> -> <li></li>
                parseEndTag(tagName)
            }
        }
        const unary = isUnaryTag(tagName) || !!unarySlash // 判断是不是一元标签
        const l = match.attrs.length
        const attrs = new Array(l)
        for (let i = 0; i < l; i++) {
            const args = match.attrs[i]
            const value = args[3] || args[4] || args[5] || ''
            const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
                ? options.shouldDecodeNewlinesForHref
                : options.shouldDecodeNewlines
            attrs[i] = {
                name: args[1],
                value: decodeAttr(value, shouldDecodeNewlines)
            }
            if (options.outputSourceRange) {
                attrs[i].start = args.start + args[0].match(/^\s*/).length
                attrs[i].end = args.end
            }
        }
        if (!unary) {// 如果不是一元标签，则放入栈里面，同时lasttag为本次的tagname
            // TODO
            stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end })
            lastTag = tagName
        }
        if (options.start) {
            options.start(tagName, attrs, unary, match.start, match.end)
        }
    }
    function parseEndTag (tagName, start, end) { // <a></a><b><c><d></c></b>
        let pos, lowerCasedTagName
        if (tagName) {
            lowerCasedTagName = tagName.toLowerCase() // tagname转化为小写
            for (pos = stack.length - 1; pos >= 0; pos--) { // 得到pos, pos表示当前tagname在栈里面的位置
                if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                    break
                }
            }
        } else {
            pos = 0
        }
        if (pos >= 0) { // 找到了tagname,或者没传入tagname
            for (let i = stack.length - 1; i >= pos; i--) {
                if ((i > pos || !tagName) && options.warn) {  // <a><b><c><d></c>
                    options.warn(
                        `tag <${stack[i].tag}> has no matching end tag.`,
                        { start: stack[i].start, end: stack[i].end }
                    )
                }
                if (options.end) {
                    options.end(stack[i].tag, start, end)
                }
            }
            stack.length = pos
            lastTag = pos && stack[pos - 1].tag // 栈顶元素的tag值
        } else if (lowerCasedTagName === 'br') {
            if (options.start) {
                options.start(tagName, [], true, start, end)
            }
        } else if (lowerCasedTagName === 'p') { // TODO
            if (options.start) {
                options.start(tagName, [], false, start, end)
            }
            if (options.end) {
                options.end(tagName, start, end)
            }
        }
    }
}
