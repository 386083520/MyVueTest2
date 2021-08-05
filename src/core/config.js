import { no, identity } from "../shared/util";

export default ({
    isReservedTag: no,
    warnHandler: null,
    parsePlatformTagName: identity,
    optionMergeStrategies: Object.create(null),
    silent: false // 是否给出提示性的警告
})
