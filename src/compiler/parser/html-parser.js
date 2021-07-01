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

export function parseHTML (html, options) {
    let index = 0
    let last,lastTag
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
                }
                const startTagMatch = parseStartTag()
                console.log(index, startTagMatch)
                if (startTagMatch) {
                     // TODO
                    console.log('gsdstartTagMatch', startTagMatch)
                }
            }
            let text
            if (textEnd >= 0) {
            }
            if (textEnd < 0) {
            }
            if (text) {
            }
        } else {

        }
        if (html === last) {
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
}
