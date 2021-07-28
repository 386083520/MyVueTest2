import { makeMap, no } from "../../shared/util";
import { unicodeRegExp } from "../../core/util/lang";

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

function decodeAttr (value, shouldDecodeNewlines) {
    const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr
    return value.replace(re, match => decodingMap[match])
}

export function parseHTML (html, options) {
    const stack = []
    let index = 0
    let last,lastTag
    const expectHTML = options.expectHTML
    const isUnaryTag = options.isUnaryTag || no
    while (html) {
        last = html
        if (!lastTag || !isPlainTextElement(lastTag)) {
            console.log('gsdaaa', lastTag)
            let textEnd = html.indexOf('<')
            if (textEnd === 0) {
                if (comment.test(html)) {
                    const commentEnd = html.indexOf('-->')
                    if (commentEnd >= 0) {
                        if (options.shouldKeepComment) {
                            options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3)
                        }
                        advance(commentEnd + 3)
                        continue
                    }
                }
                if (conditionalComment.test(html)) {
                    const conditionalEnd = html.indexOf(']>')
                    if (conditionalEnd >= 0) {
                        advance(conditionalEnd + 2)
                        continue
                    }
                }
                const doctypeMatch = html.match(doctype)
                if (doctypeMatch) {
                    advance(doctypeMatch[0].length)
                    continue
                }
                const endTagMatch = html.match(endTag)
                if (endTagMatch) {
                    console.log('gsdendTagMatch', endTagMatch)
                    const curIndex = index
                    advance(endTagMatch[0].length)
                    parseEndTag(endTagMatch[1], curIndex, index)
                    continue
                }
                const startTagMatch = parseStartTag()
                console.log(index, startTagMatch)
                if (startTagMatch) {
                    handleStartTag(startTagMatch)
                    continue
                }
            }
            let text,rest,next
            if (textEnd >= 0) {
                rest = html.slice(textEnd)
                while (!endTag.test(rest)
                &&!startTagOpen.test(rest) &&
                !comment.test(rest) &&
                !conditionalComment.test(rest)) {
                    next = rest.indexOf('<', 1)
                    if (next < 0) break
                }
                text = html.substring(0, textEnd)
            }
            if (textEnd < 0) {
            }
            if (text) {
                advance(text.length)
            }
            if (options.chars && text) {
                options.chars(text, index - text.length, index)
            }
        } else {

        }
        if (html === last) {
            /*if (!stack.length && options.warn) {
                options.warn(`Mal-formatted tag at end of template: "${html}"`, { start: index + html.length })
            }*/
            break
        }
    }
    function parseStartTag () {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
                start: index
            }
            advance(start[0].length)
            let end, attr
            while (!(end = html.match(startTagClose))  && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
                attr.start = index
                advance(attr[0].length)
                attr.end = index
                match.attrs.push(attr)
            }
            if (end) {
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
        const tagName = match.tagName
        const unarySlash = match.unarySlash
        if (expectHTML) {

        }
        const unary = isUnaryTag(tagName) || !!unarySlash
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
        }
        if (!unary) {
            // TODO
            stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end })
            lastTag = tagName
        }
        if (options.start) {
            options.start(tagName, attrs, unary, match.start, match.end)
        }
    }
    function parseEndTag (tagName, start, end) {
        let pos, lowerCasedTagName
        if (tagName) {
            lowerCasedTagName = tagName.toLowerCase()
            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                    break
                }
            }
        }
        if (pos >= 0) {
            for (let i = stack.length - 1; i >= pos; i--) {
                if ((i > pos || !tagName) && options.warn) {
                    options.warn(
                        `tag <${stack[i].tag}> has no matching end tag.`,
                        { start: stack[i].start, end: stack[i].end }
                    )
                }
            }
        }
    }
}
