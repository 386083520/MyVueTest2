import { parseFilters } from "./filter-parser";

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
const buildRegex = function () { // TODO
}
export function parseText (text, delimiters) {
    const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE
    if (!tagRE.test(text)) {
        return
    }
    const tokens = []
    const rawTokens = []
    let lastIndex = tagRE.lastIndex = 0
    let match, index, tokenValue
    while ((match = tagRE.exec(text))) {
        index = match.index
        console.log('gsdindex', index, lastIndex)
        if (index > lastIndex) {
            // TODO
        }
        const exp = parseFilters(match[1].trim())
        tokens.push(`_s(${exp})`)
        rawTokens.push({ '@binding': exp })
        lastIndex = index + match[0].length
    }
    console.log('gsdtokens', tokens)
    console.log('gsdrawTokens', rawTokens)
    // "_s(aaa)+_s(aaab)"
    // [{@binding: "aaa"}]
    return {
        expression: tokens.join('+'),
        tokens: rawTokens
    }
}
