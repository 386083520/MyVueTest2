import {isUnaryTag, canBeLeftOpenTag} from "./util";
import modules from './modules/index'
import directives from './directives/index'
import { isReservedTag, mustUseProp, isPreTag, getTagNamespace } from "../util/index";

export const baseOptions = {
    modules,
    directives,
    expectHTML: true,
    isReservedTag, // 是否是保留标签
    isUnaryTag, // 一元标签
    canBeLeftOpenTag, // 以下标签如果只写了左侧的tag，浏览器会自动补全
    mustUseProp, // TODO
    getTagNamespace,  // 获取标签名的命名空间
    isPreTag // 是否是pre标签
}
