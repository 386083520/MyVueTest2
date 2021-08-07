import {isUnaryTag} from "./util";
import modules from './modules/index'
import directives from './directives/index'
import { isReservedTag } from "../util/index";

export const baseOptions = {
    modules,
    directives,
    expectHTML: true,
    isReservedTag, // 是否是保留标签
    isUnaryTag
}
