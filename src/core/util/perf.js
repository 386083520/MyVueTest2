import { inBrowser } from "./env";

export let mark
if (true) { // TODO
    const perf = inBrowser && window.performance
    if (perf && perf.mark) {
        mark = tag => perf.mark(tag)
    }
}
