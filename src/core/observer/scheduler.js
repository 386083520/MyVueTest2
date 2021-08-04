import { nextTick } from "../util/index";

let waiting = false
function flushSchedulerQueue () {

}

export function queueWatcher (watcher) {
    console.log('gsdqueueWatcher')
    if (!waiting) {
        waiting = true
        nextTick(flushSchedulerQueue)
    }
}
