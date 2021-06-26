import { no, identity } from "../shared/util";

export default ({
    isReservedTag: no,
    parsePlatformTagName: identity,
    optionMergeStrategies: Object.create(null)
})
