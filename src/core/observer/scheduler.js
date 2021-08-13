import { nextTick } from "../util/index";

let waiting = false
const queue = []
let has = {}
let flushing = false
let index = 0
function resetSchedulerState () {
    waiting = flushing = false
}

function flushSchedulerQueue () {
    console.log('gsdflushSchedulerQueue')
    let watcher, id
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index]
        id = watcher.id
        has[id] = null
        watcher.run()
    }
    resetSchedulerState() // 重置Scheduler里面一些状态
}

export function queueWatcher (watcher) {
    const id = watcher.id
    console.log('gsdhas', has[id])
    if (has[id] == null) {
        has[id] = true
        if (!flushing) {
            queue.push(watcher)
        } else {
            // TODO
        }
        if (!waiting) { // nextTick正在执行的标志位
            waiting = true
            console.log('gsdnextTick')
            nextTick(flushSchedulerQueue)
        }
    }
}
