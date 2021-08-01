const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
const buildRegex = function () { // TODO
}
export function parseText (text, delimiters) {
    const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE
}
