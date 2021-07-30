export function baseWarn (msg, range) {
    console.error(`[Vue compiler]: ${msg}`)
}
export function pluckModuleFunction(modules, key) {
    return modules
        ? modules.map(m => m[key]).filter(_ => _)
        : []
}
