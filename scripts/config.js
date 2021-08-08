const path = require('path')
const aliases = require('./alias')

const resolve = p => {
    const base = p.split('/')[0]
    if (aliases[base]) {
        return path.resolve(aliases[base], p.slice(base.length + 1))
    }else{
        return path.resolve(__dirname, '../', p)
    }
}

const builds = {
    'web-runtime-dev': {
        entry: resolve('web/entry-runtime.js'),
        dest: resolve('dist/vue.runtime.js'),
        format: 'umd'
    },
    'web-full-dev': {
        entry: resolve('web/entry-runtime-with-compiler.js'),
        dest: resolve('dist/vue.js'),
        format: 'umd',
        alias: { he: './entity-decoder' },
    }
}

function genConfig (name) {
    const opts = builds[name]
    const config = {
        input: opts.entry,
        output: {
            file: opts.dest,
            format: opts.format,
            name: 'Vue'
        }
    }
    return config
}

exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
