import { hasOwn, camelize } from "../../shared/util";
import config from "../config"
import {LIFECYCLE_HOOKS} from "../../shared/constants";

const strats = config.optionMergeStrategies
export function resolveAsset (options, type, id, warnMissing) {
    if (typeof id !== 'string') {
        return
    }
    const assets = options[type]
    if (hasOwn(assets, id)) return assets[id]
    // TODO
    const res = assets[id] // TODO
    if (warnMissing && !res) { // TODO
    }
    return res

}
const defaultStrat = function (parentVal, childVal) {  // 默认的策略：childVal有值就用childVal，没值采用parentVal
    return childVal === undefined
        ? parentVal
        : childVal
}

function mergeHook (parentVal, childVal) { // 给出传入生命周期函数的合并策略
    console.log('gsdmergeHook')
    const res = childVal? parentVal? parentVal.concat(childVal): Array.isArray(childVal) ? childVal: [childVal]: parentVal
    return res
        ? dedupeHooks(res)
        : res
}

function dedupeHooks (hooks) { // 对hooks的一个去重
    const res = []
    for (let i = 0; i < hooks.length; i++) {
        if (res.indexOf(hooks[i]) === -1) {
            res.push(hooks[i])
        }
    }
    return res
}


export function mergeOptions (parent, child, vm) {
    const options = {}
    let key
    for (key in parent) {
        mergeField(key)
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key)
        }
    }
    function mergeField (key) {
        const strat = strats[key] || defaultStrat
        options[key] = strat(parent[key], child[key])
    }
    return options
}


LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})
