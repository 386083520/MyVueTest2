// 检测template里面有问题的表达式
export function detectErrors (ast, warn) {
    if (ast) {
        checkNode(ast, warn)
    }
}

function checkNode (node, warn) {
}
