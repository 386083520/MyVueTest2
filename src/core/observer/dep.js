export default class Dep {
    constructor () {
        this.subs = []
    }
    addSub (sub) {
        this.subs.push(sub)
    }
    depend () {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }
    notify () {
        const subs = this.subs.slice()
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}

Dep.target = null
const targetStack = []
export function pushTarget (target) {
    targetStack.push(target)
    Dep.target = target
}
export function popTarget () {
    targetStack.pop()
    Dep.target = targetStack[targetStack.length - 1]
}
