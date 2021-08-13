import { warn } from "../../../core/util/index";

export * from './element'
export * from './attrs'
export * from './class'

export function query (el) { // 根据传入的值找到对应的元素
    if (typeof el === 'string') {
        const selected = document.querySelector(el)
        if (!selected) {
            warn(
                'Cannot find element: ' + el
            )
            return document.createElement('div')
        }
        return selected
    }else {
        return el
    }
}
