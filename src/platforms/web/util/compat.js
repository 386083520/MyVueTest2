import { inBrowser } from "../../../core/util/index";

let div
function getShouldDecode (href) {
    div = div || document.createElement('div')
    div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`
    return div.innerHTML.indexOf('&#10;') > 0
}

export const shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false
export const shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false
