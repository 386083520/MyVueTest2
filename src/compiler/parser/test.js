/*let div
function getShouldDecode (href) {
    div = div || document.createElement('div')
    div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`
    return div.innerHTML.indexOf('&#10;') > 0
}

console.log(getShouldDecode(true))*/
// const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
/*const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
// console.log('{{ab\r\nc}}{{abcd}}'.match(defaultTagRE))

let match
while ((match = defaultTagRE.exec('{{abc}}{{abcd}}{{abcde}}'))) {
    console.log(match)
}*/
/*let callbacks = [
    'ccc',
    {
        'aaa': 'aaaa'
    },
    {
        'bbb': 'aaaa'
    }
]

const copies = callbacks.slice(0)
copies[1]['aaa'] = 'aaaaa'
console.log(copies)
console.log(callbacks)*/

/*const argRE = /:(.*)$/

const argMatch = ':'.match(argRE)
console.log(argMatch)*/


/*const camelizeRE = /-(\w)/g // 0-9 a-z A-Z _
const camelize = (str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
}
console.log(camelize('show'))*/

function toArray (list, start) {
    debugger
    start = start || 0
    let i = list.length - start
    const ret = new Array(i)
    while (i--) {
        ret[i] = list[i + start]
    }
    return ret
}

console.log(toArray([1,2,3,4,5], 2))


