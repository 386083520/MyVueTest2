(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    const _toString = Object.prototype.toString;

    function noop (a, b, c) {
    }

    function isUndef(v) {
        return v === undefined || v === null
    }

    function isDef (v) {
        return v !== undefined && v !== null
    }

    function isPrimitive (value) {
        return (
            typeof value === 'string' ||
            typeof value === 'number' ||
            // $flow-disable-line
            typeof value === 'symbol' ||
            typeof value === 'boolean'
        )
    }

    function isTrue (v) {
        return v === true
    }

    const no = (a, b, c) => {
        return (a === 'div' || a === 'h1')
    }; // TODO

    const identity = (_) => _;

    const hasOwnProperty = Object.prototype.hasOwnProperty;
    function hasOwn (obj, key) {
        return hasOwnProperty.call(obj, key)
    }
    function isObject(obj) {
        return obj !== null && typeof obj === 'object'
    }

    function isPlainObject (obj) {
        return _toString.call(obj) === '[object Object]'
    }

    function toString (val) {
        return val == null? '': String(val)
    }

    function makeMap (str, expectsLowerCase) {
        const map = Object.create(null);
        const list = str.split(',');
        for (let i = 0; i < list.length; i++) {
            map[list[i]] = true;
        }
        return expectsLowerCase
            ? val => map[val.toLowerCase()]
            : val => map[val]
    }

    function cached (fn) { // 一个高阶函数，避免fn被重复的执行，减少时间损耗
        const cache = Object.create(null);
        return (function cachedFn (str) {
            const hit = cache[str];
            return hit || (cache[str] = fn(str))
        })
    }

    const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

    function def (obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        });
    }

    var config = ({
        isReservedTag: no,
        warnHandler: null,
        parsePlatformTagName: identity,
        optionMergeStrategies: Object.create(null),
        silent: false // 是否给出提示性的警告
    });

    const strats = config.optionMergeStrategies;
    function resolveAsset (options, type, id, warnMissing) {
        if (typeof id !== 'string') {
            return
        }
        const assets = options[type];
        if (hasOwn(assets, id)) return assets[id]
    }
    const defaultStrat = function (parentVal, childVal) {
        return childVal === undefined
            ? parentVal
            : childVal
    };


    function mergeOptions (parent, child, vm) {
        const options = {};
        let key;
        for (key in parent) {
            mergeField(key);
        }
        for (key in child) {
            if (!hasOwn(parent, key)) {
                mergeField(key);
            }
        }
        function mergeField (key) {
            const strat = strats[key] || defaultStrat;
            options[key] = strat(parent[key], child[key]);
        }
        return options
    }

    const inBrowser = typeof window !== 'undefined';

    function isNative (Ctor) {
        return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
    }

    let warn = noop;
    let generateComponentTrace = noop;
    let formatComponentName = noop;

    const hasConsole = typeof console !== 'undefined'; // 是否有console这个方法

    warn = (msg, vm) => { // 代码异常情况的警告处理
        const trace = vm ? generateComponentTrace(vm) : '';
        if (config.warnHandler) ;else if(hasConsole && (!config.silent)){
            console.error(`[Vue warn]: ${msg}${trace}`);
        }
    };

    formatComponentName = (vm, includeFile) => {
        console.log('gsdvm', vm);
        if (vm.$root === vm || true) {
            return '<Root>'
        }
    };

    generateComponentTrace = vm => {
        if (vm._isVue && vm.$parent) ; else {
            return `\n\n(found in ${formatComponentName(vm)})`
        }
    };

    const callbacks = [];
    let pending = false;
    let timerFunc;

    function flushCallbacks () {
        pending = false;
        const copies = callbacks.slice(0);
        callbacks.length = 0;
        for (let i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
    if (typeof Promise !== 'undefined' && isNative(Promise)) {
        const p = Promise.resolve();
        timerFunc = () => {
            console.log('gsdtimerFunc');
            p.then(flushCallbacks);
        };
    } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
        timerFunc = () => {
            setImmediate(flushCallbacks);
        };
    } else {
        timerFunc = () => {
            setTimeout(flushCallbacks, 0);
        };
    }
    console.log('timerFunc', timerFunc);
    function nextTick (cb, ctx) { // TODO
        callbacks.push(() => {
            try {
                cb.call(ctx);
            } catch (e) {
                // TODO
            }
        });
        if (!pending) {
            pending = true;
            // 启动异步函数
            console.log('gsdtimerFunc2');
            timerFunc();
        }
        console.log('callbacks', callbacks.length);
    }

    class VNode {
        constructor (tag, data, children, text, elm, context, componentOptions, asyncFactory) {
            this.tag = tag;
            this.data = data;
            this.children = children;
            this.text = text;
            this.elm = elm;
            this.context = context;
            this.componentOptions = componentOptions;
            this.asyncFactory = asyncFactory;
        }
    }

    function createTextVNode (val) {
        return new VNode(undefined, undefined, undefined, String(val))
    }

    function normalizeChildren (children) {
        return isPrimitive(children) ? [createTextVNode(children)]: (Array.isArray(children) ? normalizeArrayChildren(children): undefined)
    }

    function normalizeArrayChildren (children) {
        const res = [];
        let i, c;
        for (i = 0; i < children.length; i++) {
            c = children[i];
            if (Array.isArray(c)) ;else if(isPrimitive(c)) ; else {
                res.push(c);
            }
        }
        console.log('res', res);
        return res
    }

    class Dep {
        constructor () {
            this.subs = [];
        }
        addSub (sub) {
            this.subs.push(sub);
        }
        depend () {
            if (Dep.target) {
                Dep.target.addDep(this);
            }
        }
        notify () {
            const subs = this.subs.slice();
            for (let i = 0, l = subs.length; i < l; i++) {
                subs[i].update();
            }
        }
    }

    Dep.target = null;
    function pushTarget (target) {
        Dep.target = target;
    }

    let waiting = false;
    const queue = [];
    let has = {};
    let index = 0;
    function flushSchedulerQueue () {
        console.log('gsdflushSchedulerQueue');
        let watcher, id;
        for (index = 0; index < queue.length; index++) {
            watcher = queue[index];
            id = watcher.id;
            has[id] = null;
            watcher.run();
        }
    }

    function queueWatcher (watcher) {
        const id = watcher.id;
        if (has[id] == null) {
            has[id] = true;
            {
                queue.push(watcher);
            }
            if (!waiting) {
                waiting = true;
                console.log('gsdnextTick');
                nextTick(flushSchedulerQueue);
            }
        }
    }

    class Watcher {
        constructor (vm, expOrFn, cb, options, isRenderWatcher) {
            console.log('gsdvm', vm);
            this.vm = vm;
            this.depIds = new Set();
            this.newDepIds = new Set();
            this.newDeps = [];
            this.active = true;
            if (typeof expOrFn === 'function') {
                this.getter = expOrFn;
            }
            this.value = this.lazy
                ? undefined
                : this.get();
        }
        get () {
            pushTarget(this);
            let value;
            const vm = this.vm;
            try {
                // value = this.getter.call(vm, vm)
                value = this.getter(); // TODO
            } catch (e) {
            } finally {
            }
            return value
        }
        addDep (dep) {
            const id = dep.id;
            if (!this.newDepIds.has(id)) {
                this.newDepIds.add(id);
                this.newDeps.push(dep);
                if (!this.depIds.has(id)) {
                    dep.addSub(this);
                }
            }
        }
        update () {
            console.log('gsdupdate');
            {
                queueWatcher(this);
            }
        }
        run () {
            console.log('gsdrun');
            if (this.active) {
                const value = this.get();
            }
        }
    }

    let activeInstance = null;

    function setActiveInstance(vm) {
        const prevActiveInstance = activeInstance;
        activeInstance = vm;
        return () => {
            activeInstance = prevActiveInstance;
        }
    }

    function initLifecycle (vm) {
        const options = vm.$options;
        let parent = options.parent;
        if (parent && !options.abstract) {
            parent.$children.push(vm);
        }
        console.log('gsdparent', parent);
        vm.$parent = parent;
        vm.$children = [];
    }

    function lifecycleMixin (Vue) {
        Vue.prototype._update = function (vnode, hydrating) {
            const vm = this;
            const prevVnode = vm._vnode;
            const restoreActiveInstance = setActiveInstance(vm);
            vm._vnode = vnode;
            if (!prevVnode) {
                vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false);
            } else {
                vm.$el = vm.__patch__(prevVnode, vnode);
            }
            restoreActiveInstance();
        };
    }

    function mountComponent (vm, el, hydrating) {
        vm.$el = el;
        let updateComponent;
        updateComponent = () => {
            vm._update(vm._render(), hydrating);
        };
        console.log('gsdmountComponent');
        new Watcher(vm, updateComponent, noop, {}, true);
        return vm
    }

    const componentVNodeHooks = {
        init (vnode, hydrating) {
            console.log('gsdinit');
            if (
                vnode.componentInstance &&
                !vnode.componentInstance._isDestroyed &&
                vnode.data.keepAlive
            ) ;else {
                const child = vnode.componentInstance = createComponentInstanceForVnode(
                    vnode,
                    activeInstance
                );
                child.$mount(hydrating ? vnode.elm : undefined, hydrating);
            }
        },
        prepatch () {
            console.log('gsdprepatch');
        },
        insert () {
            console.log('gsdinsert');
        },
        destroy () {
            console.log('gsddestroy');
        }
    };

    const hooksToMerge = Object.keys(componentVNodeHooks);

    function createComponent (Ctor, data, context, children, tag) {
        console.log('createComponent', context);
        if (isUndef(Ctor)) {
            return
        }
        const baseCtor = context.$options._base;
        if (isObject(Ctor)) {
            Ctor = baseCtor.extend(Ctor);
        }
        if (typeof Ctor !== 'function') {
            return
        }
        let asyncFactory;
        if (isUndef(Ctor.cid)) ;
        data = data || {};
        const propsData = ''; // TODO
        const listeners = data.on;
        // TODO
        installComponentHooks(data);
        const name = Ctor.options.name || tag;
        const vnode = new VNode(
            `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
            data, undefined, undefined, undefined, context,{ Ctor, propsData, listeners, tag, children } ,asyncFactory);
        console.log('gsdvnode', vnode);
        return vnode
    }

    function installComponentHooks (data) {
        const hooks = data.hook || (data.hook = {});
        for (let i = 0; i < hooksToMerge.length; i++) {
            const key = hooksToMerge[i];
            const existing = hooks[key];
            const toMerge = componentVNodeHooks[key];
            if (existing !== toMerge && !(existing && existing._merged)) {
                hooks[key] = toMerge;
            }
        }
        console.log('gsdinstallComponentHooks');
    }

    function createComponentInstanceForVnode (vnode, parent) {
        const options = {
            _isComponent: true,
            _parentVnode: vnode,
            parent
        };
        return new vnode.componentOptions.Ctor(options)
    }

    const ALWAYS_NORMALIZE = 2;

    function createElement (context, tag, data, children, normalizationType, alwaysNormalize) {
        if (Array.isArray(data) || isPrimitive(data)) {
            normalizationType = children;
            children = data;
            data = undefined;
        }
        if (isTrue(alwaysNormalize)) {
            normalizationType = ALWAYS_NORMALIZE;
        }
        return _createElement(context, tag, data, children, normalizationType)
    }

    function _createElement (context, tag, data, children, normalizationType) {
        if (normalizationType === ALWAYS_NORMALIZE) {
            children = normalizeChildren(children);
        }
        let vnode;
        if (typeof tag === 'string') {
            let Ctor;
            if (config.isReservedTag(tag)) {
                vnode = new VNode(
                    config.parsePlatformTagName(tag), data, children,
                    undefined, undefined, context
                );
            } else if ((!data) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
                console.log('Ctor', Ctor);
                vnode = createComponent(Ctor, data, context, children, tag);
            } else {
                vnode = new VNode(
                    tag, data, children,
                    undefined, undefined, context
                );
                console.log('gsdvnode1', vnode);
            }
        }
         // TODO
        return vnode
    }

    function installRenderHelpers (target) {
        target._v = createTextVNode;
        target._s = toString;
    }

    function initRender (vm) {
        vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
        vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
    }

    function renderMixin (Vue) {
        installRenderHelpers(Vue.prototype);
        Vue.prototype._render = function () {
            const vm = this;
            const { render, _parentVnode } = vm.$options;
            vm.$vnode = _parentVnode;
            console.log('gsdvue', this);
            let vnode;
            vnode = render.call(vm._renderProxy, vm.$createElement);
            console.log('gsdvnode', vnode);
            return vnode
        };
    }

    let initProxy;
    initProxy = function initProxy (vm) {
        vm._renderProxy = vm;
    };

    class Observer {
        constructor (value) {
            this.value = value;
            this.dep = new Dep();
            this.vmCount = 0;
            def(value, '__ob__', this);
            if (Array.isArray(value)) {
                this.observeArray(value);
            } else {
                this.walk(value);
            }
        }
        walk (obj) {
            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
                defineReactive(obj, keys[i]);
            }
        }
        observeArray (items) {
        }
    }

    function observe (value, asRootData) {
        if (!isObject(value)) { // TODO
            return
        }
        let ob;
        if((Array.isArray(value) || isPlainObject(value))) {
            ob = new Observer(value);
        }
        return ob
    }

    function defineReactive (obj, key, val) {
        const dep = new Dep();
        const property = Object.getOwnPropertyDescriptor(obj, key);
        if (property && property.configurable === false) {
            return
        }
        // TODO
        if (arguments.length === 2) {
            val = obj[key];
        }
        let childOb = observe(val); // TODO
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter () {
                const value = val;
                console.log('gsdget', value);
                if (Dep.target) {
                    dep.depend();
                }
                return value
            },
            set: function reactiveSetter (newVal) {
                const value = val;
                if (newVal === value) {
                    return
                }
                {
                    val = newVal;
                }
                dep.notify();
            }
        });
    }

    const sharedPropertyDefinition = {
        enumerable: true,
        configurable: true,
        get: noop,
        set: noop
    };

    function proxy (target, sourceKey, key) {
        sharedPropertyDefinition.get = function proxyGetter () {
            return this[sourceKey][key]
        };
        sharedPropertyDefinition.set = function proxySetter (val) {
            this[sourceKey][key] = val;
        };
        Object.defineProperty(target, key, sharedPropertyDefinition);
    }

    function initState (vm) {
        const opts = vm.$options;
        if (opts.data) {
            initData(vm);
        }
    }

    function initData (vm) {
        let data = vm.$options.data;
        console.log('gsddata', data);
        data = vm._data = (typeof data === 'function' ? getData(): data || {});
        if (!isPlainObject(data)) {
            data = {};
            // TODO
        }
        const keys = Object.keys(data);
        let i = keys.length;
        while (i--) {
            const key = keys[i];
            {
                proxy(vm, `_data`, key);
            }
        }
        observe(data);
    }

    function getData (data, vm) {
    }

    function initMixin (Vue) {
        Vue.prototype._init = function (options) {
            const vm = this;
            if (options && options._isComponent) {
                initInternalComponent(vm, options);
            }else {
                vm.$options = mergeOptions(options || {}, resolveConstructorOptions(vm.constructor));
                console.log('gsd', vm.$options);
            }
            initProxy(vm);
            initLifecycle(vm);
            initRender(vm);
            initState(vm);
            if (vm.$options.el) {
                console.log('gsd el', vm.$options.el);
                vm.$mount(vm.$options.el);
            }
        };
    }

    function resolveConstructorOptions (Ctor) {
        let options = Ctor.options;
        // TODO
        return options
    }

    function initInternalComponent (vm, options) {
        const opts = vm.$options = Object.create(vm.constructor.options);
        const parentVnode = options._parentVnode;
        opts.parent = options.parent;
        opts._parentVnode = parentVnode;
        const vnodeComponentOptions = parentVnode.componentOptions;
        opts.propsData = vnodeComponentOptions.propsData;
        opts._parentListeners = vnodeComponentOptions.listeners;
        opts._renderChildren = vnodeComponentOptions.children;
        opts._componentTag = vnodeComponentOptions.tag;

    }

    function Vue (options) {
        this._init(options);
    }
    initMixin(Vue);
    lifecycleMixin(Vue);
    renderMixin(Vue);

    function initExtend (Vue) {
        Vue.cid = 0;
        let cid = 1;
        Vue.extend = function (extendOptions) {
            extendOptions = extendOptions || {};
            const Super = this;
            const SuperId = Super.cid;
            console.log('gsdSuperId', SuperId);
            const Sub = function VueComponent (options) {
                this._init(options);
            };
            Sub.prototype = Object.create(Super.prototype);
            Sub.prototype.constructor = Sub;
            Sub.cid = cid++;
            Sub.options = mergeOptions(
                Super.options,
                extendOptions
            );
            console.log('gsdSub', Sub.cid);
            return Sub
        };
    }

    function initGlobalAPI (Vue) {
        Vue.options = Object.create(null);
        Vue.options._base = Vue;
        initExtend(Vue);
    }

    initGlobalAPI(Vue);

    function createPatchFunction (backend) {
        const { modules, nodeOps } = backend;
        function createElm (vnode, insertedVnodeQueue, parentElm, refElm) {
            if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
                return
            }
            const data = vnode.data;
            const children = vnode.children;
            const tag = vnode.tag;
            if (isDef(tag)) {
                vnode.elm = nodeOps.createElement(tag, vnode);
                console.log('gsdelm', vnode.elm);
                createChildren(vnode, children, insertedVnodeQueue);
                insert(parentElm, vnode.elm);
            } else {
                vnode.elm = nodeOps.createTextNode(vnode.text);
                insert(parentElm, vnode.elm);
            }
        }
        function createChildren (vnode, children, insertedVnodeQueue) {
            if (Array.isArray(children)) {
                for (let i = 0; i < children.length; ++i) {
                    createElm(children[i], insertedVnodeQueue, vnode.elm);
                }
            } else if (isPrimitive(vnode.text)) ;
        }
        function insert (parent, elm, ref) {
            if (isDef(parent)) {
                if (isDef(ref)) ;else {
                    nodeOps.appendChild(parent, elm);
                }
            }
        }
        function emptyNodeAt (elm) {
            return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
        }
        function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
            let i = vnode.data;
            if (isDef(i)) {
                const isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
                if (isDef(i = i.hook) && isDef(i = i.init)) {
                    i(vnode, false);
                }
                if (isDef(vnode.componentInstance)) {
                    initComponent(vnode);
                    insert(parentElm, vnode.elm, refElm);
                    return true
                }
            }
        }
        function initComponent (vnode, insertedVnodeQueue) {
            if (isDef(vnode.data.pendingInsert)) ;
            vnode.elm = vnode.componentInstance.$el;
        }
        return function patch (oldVnode, vnode, hydrating, removeOnly) {
            const insertedVnodeQueue = [];
            if (isUndef(oldVnode)) {
                createElm(vnode, insertedVnodeQueue);
            } else {
                const isRealElement = isDef(oldVnode.nodeType);
                if (isRealElement) {
                    oldVnode = emptyNodeAt(oldVnode);
                }
                const oldElm = oldVnode.elm;
                const parentElm = nodeOps.parentNode(oldElm);
                console.log('gsdcreateElm', vnode);
                createElm(vnode, insertedVnodeQueue, parentElm, nodeOps.nextSibling(oldElm));
            }
            console.log('gsdpatch', vnode.elm);
            return vnode.elm
        }
    }

    function createElement$1 (tagName, vnode) {
        const elm = document.createElement(tagName);
        return elm
    }

    function appendChild (node, child) {
        node.appendChild(child);
    }

    function tagName(node) {
        return node.tagName
    }

    function parentNode (node) {
        return node.parentNode
    }

    function createTextNode (text) {
        return document.createTextNode(text)
    }

    function nextSibling (node) {
        return node.nextSibling
    }

    var nodeOps = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createElement: createElement$1,
        appendChild: appendChild,
        tagName: tagName,
        parentNode: parentNode,
        createTextNode: createTextNode,
        nextSibling: nextSibling
    });

    const modules = '';
    const patch = createPatchFunction({nodeOps, modules});

    Vue.prototype.__patch__ = patch;

    Vue.prototype.$mount = function (el, hydrating) {
        return mountComponent(this, el, hydrating)
    };

    function query (el) { // 根据传入的值找到对应的元素
        if (typeof el === 'string') {
            const selected = document.querySelector(el);
            if (!selected) {
                warn(
                    'Cannot find element: ' + el
                );
                return document.createElement('div')
            }
            return selected
        }else {
            return el
        }
    }

    function createFunction (code, errors) {
        try {
            return new Function(code)
        } catch (err) {
        }
    }

    function createCompileToFunctionFn (compile) {
        return function compileToFunctions (template, options, vm) {
            const compiled = compile(template, options);
            console.log('gsdcompileToFunctions');
            const res = {};
            res.render = createFunction(compiled.render);
            res.staticRenderFns = {}; // TODO
            return res
        }
    }

    function createCompilerCreator (baseCompile) {
        return function createCompiler (baseOptions) {
            function compile (template, options) {
                const finalOptions = Object.create(baseOptions);
                if (options) {
                    for (var key in options) {
                        if (key !== 'modules' && key !== 'directives') {
                            finalOptions[key] = options[key];
                        }
                    }
                }
                const compiled = baseCompile(template.trim(), finalOptions);
                return compiled
            }
            return {
                compile,
                compileToFunctions: createCompileToFunctionFn(compile)
            }
        }
    }

    const comment = /^<!\--/;
    const conditionalComment = /^<!\[/;
    const doctype =/^<!DOCTYPE [^>]+>/i;
    const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
    const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
    const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
    const startTagOpen = new RegExp(`^<${qnameCapture}`);
    const startTagClose = /^\s*(\/?)>/;
    const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    const isPlainTextElement = makeMap('script,style,textarea', true);

    const decodingMap = {
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&amp;': '&',
        '&#10;': '\n',
        '&#9;': '\t',
        '&#39;': "'"
    };
    const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
    const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;

    function decodeAttr (value, shouldDecodeNewlines) {
        const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
        return value.replace(re, match => decodingMap[match])
    }

    function parseHTML (html, options) {
        const stack = [];
        let index = 0;
        let last,lastTag;
        const expectHTML = options.expectHTML;
        const isUnaryTag = options.isUnaryTag || no;
        while (html) {
            last = html;
            if (!lastTag || !isPlainTextElement(lastTag)) {
                console.log('gsdaaa', lastTag);
                let textEnd = html.indexOf('<');
                if (textEnd === 0) {
                    if (comment.test(html)) {
                        const commentEnd = html.indexOf('-->');
                        if (commentEnd >= 0) {
                            if (options.shouldKeepComment) {
                                options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
                            }
                            advance(commentEnd + 3);
                            continue
                        }
                    }
                    if (conditionalComment.test(html)) {
                        const conditionalEnd = html.indexOf(']>');
                        if (conditionalEnd >= 0) {
                            advance(conditionalEnd + 2);
                            continue
                        }
                    }
                    const doctypeMatch = html.match(doctype);
                    if (doctypeMatch) {
                        advance(doctypeMatch[0].length);
                        continue
                    }
                    const endTagMatch = html.match(endTag);
                    if (endTagMatch) {
                        console.log('gsdendTagMatch', endTagMatch);
                        const curIndex = index;
                        advance(endTagMatch[0].length);
                        parseEndTag(endTagMatch[1], curIndex, index);
                        continue
                    }
                    const startTagMatch = parseStartTag();
                    console.log(index, startTagMatch);
                    if (startTagMatch) {
                        handleStartTag(startTagMatch);
                        continue
                    }
                }
                let text,rest,next;
                if (textEnd >= 0) {
                    rest = html.slice(textEnd);
                    while (!endTag.test(rest)
                    &&!startTagOpen.test(rest) &&
                    !comment.test(rest) &&
                    !conditionalComment.test(rest)) {
                        next = rest.indexOf('<', 1);
                        if (next < 0) break
                    }
                    text = html.substring(0, textEnd);
                }
                if (text) {
                    advance(text.length);
                }
                if (options.chars && text) {
                    options.chars(text, index - text.length, index);
                }
            }
            if (html === last) {
                /*if (!stack.length && options.warn) {
                    options.warn(`Mal-formatted tag at end of template: "${html}"`, { start: index + html.length })
                }*/
                break
            }
        }
        function parseStartTag () {
            const start = html.match(startTagOpen);
            if (start) {
                const match = {
                    tagName: start[1],
                    attrs: [],
                    start: index
                };
                advance(start[0].length);
                let end, attr;
                while (!(end = html.match(startTagClose))  && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
                    attr.start = index;
                    advance(attr[0].length);
                    attr.end = index;
                    match.attrs.push(attr);
                }
                if (end) {
                    match.unarySlash = end[1];
                    advance(end[0].length);
                    match.end = index;
                    return match
                }
            }
        }
        function advance (n) {
            index += n;
            html = html.substring(n);
        }
        function handleStartTag (match) {
            const tagName = match.tagName;
            const unarySlash = match.unarySlash;
            const unary = isUnaryTag(tagName) || !!unarySlash;
            const l = match.attrs.length;
            const attrs = new Array(l);
            for (let i = 0; i < l; i++) {
                const args = match.attrs[i];
                const value = args[3] || args[4] || args[5] || '';
                const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
                    ? options.shouldDecodeNewlinesForHref
                    : options.shouldDecodeNewlines;
                attrs[i] = {
                    name: args[1],
                    value: decodeAttr(value, shouldDecodeNewlines)
                };
            }
            if (!unary) {
                // TODO
                stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end });
                lastTag = tagName;
            }
            if (options.start) {
                options.start(tagName, attrs, unary, match.start, match.end);
            }
        }
        function parseEndTag (tagName, start, end) {
            let pos, lowerCasedTagName;
            if (tagName) {
                lowerCasedTagName = tagName.toLowerCase();
                for (pos = stack.length - 1; pos >= 0; pos--) {
                    if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                        break
                    }
                }
            }
            if (pos >= 0) {
                for (let i = stack.length - 1; i >= pos; i--) {
                    if ((i > pos || !tagName) && options.warn) {
                        options.warn(
                            `tag <${stack[i].tag}> has no matching end tag.`,
                            { start: stack[i].start, end: stack[i].end }
                        );
                    }
                    if (options.end) {
                        options.end(stack[i].tag, start, end);
                    }
                }
            }
        }
    }

    function baseWarn (msg, range) {
        console.error(`[Vue compiler]: ${msg}`);
    }
    function pluckModuleFunction(modules, key) {
        return modules
            ? modules.map(m => m[key]).filter(_ => _)
            : []
    }

    function parseFilters (exp) {
        return exp // TODO
    }

    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
    const buildRegex = function () { // TODO
    };
    function parseText (text, delimiters) {
        const tagRE = delimiters ? buildRegex() : defaultTagRE;
        if (!tagRE.test(text)) {
            return
        }
        const tokens = [];
        const rawTokens = [];
        let lastIndex = tagRE.lastIndex = 0;
        let match, index;
        while ((match = tagRE.exec(text))) {
            index = match.index;
            console.log('gsdindex', index, lastIndex);
            const exp = parseFilters(match[1].trim());
            tokens.push(`_s(${exp})`);
            rawTokens.push({ '@binding': exp });
            lastIndex = index + match[0].length;
        }
        console.log('gsdtokens', tokens);
        console.log('gsdrawTokens', rawTokens);
        // "_s(aaa)+_s(aaab)"
        // [{@binding: "aaa"}]
        return {
            expression: tokens.join('+'),
            tokens: rawTokens
        }
    }

    let warn$1;

    let transforms;
    let delimiters;

    function createASTElement (tag, attrs, parent) {
        return {
            type: 1,
            tag,
            attrsList: attrs,
            attrsMap: makeAttrsMap(attrs),
            rawAttrsMap: {},
            parent,
            children: []
        }
    }
    function processElement (element, options) {
        for (let i = 0; i < transforms.length; i++) {
            element = transforms[i](element, options) || element;
        }
    }
    function parse (template, options) {
        delimiters = options.delimiters;
        let root;
        let currentParent;
        const stack = [];
        warn$1 = options.warn || baseWarn;
        transforms = pluckModuleFunction(options.modules, 'transformNode');
        function closeElement (element) {
            if ( !element.processed) {
                element = processElement(element, options);
            }
        }
        parseHTML(template, {
            warn: warn$1,
            expectHTML: options.expectHTML,
            isUnaryTag: options.isUnaryTag,
            shouldKeepComment: options.comments,
            start (tag, attrs, unary, start, end) {
                let element = createASTElement(tag, attrs, currentParent);
                if (!root) {
                    root = element;
                }
                if (!unary) {
                    currentParent = element;
                    stack.push(element);
                }
            },
            end (tag, start, end) {
                const element = stack[stack.length - 1];
                stack.length -= 1;
                closeElement(element);
            },
            chars (text, start, end) {
                const children = currentParent.children;
                if (text) {
                    let res;
                    let child;
                    if ( text !== ' ' && (res = parseText(text, delimiters))) { // TODO
                        console.log('gsdres', res);
                        child = {
                            type: 2,
                            expression: res.expression,
                            tokens: res.tokens,
                            text
                        };
                    }else if(text !== ' ' || !children.length) { // TODO
                        child = {
                            type: 3,
                            text
                        };
                    }
                    if (child) {
                        if (options.outputSourceRange) {
                            child.start = start;
                            child.end = end;
                        }
                        children.push(child);
                    }
                }
            },
            comment (text, start, end) {
                if (currentParent) {
                    const child = {
                        type: 3,
                        text,
                        isComment: true
                    };
                    currentParent.children.push(child);
                }
            }
        });
        return root
    }

    function makeAttrsMap(attrs) {
        const map = {};
        for (let i = 0, l = attrs.length; i < l; i++) {
            map[attrs[i].name] = attrs[i].value;
        }
        return map
    }

    class CodegenState {
        constructor (options) {
            this.options = options;
            this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
            console.log('gsddataGenFns', this.dataGenFns);
        }
    }

    function generate (ast, options) {
        const state = new CodegenState(options);
        const code = ast ? genElement(ast, state) : '_c("div")';
        return {
            render: `with(this){return ${code}}`, // TODO
            staticRenderFns: {}
        }
    }

    function genElement (el, state) {
        {
            let code;
            if (el.component) ;else {
                // {staticClass:"container"},[_v("aaa")]
                let data;
                { // TODO
                    data = genData(el, state);
                }
                const children = genChildren(el, state); // TODO
                code = `_c('${el.tag}'${data ? `,${data}` : ''}${children ? `,${children}` : ''})`;
            }
            return code
        }
    }

    function genData (el, state) {
        let data = '{';
        for (let i = 0; i < state.dataGenFns.length; i++) {
            data += state.dataGenFns[i](el);
        }
        data = data.replace(/,$/, '') + '}';
        console.log('gsddata', data);
        return data
    }

    function genChildren (el, state, checkSkip, altGenElement, altGenNode) {
        const children = el.children;
        if (children.length) {
            const el = children[0];
            const gen = altGenNode || genNode;
            return `[${children.map(c => gen(c, state)).join(',')}]`
        }
    }

    function genNode (node, state) {
        if (node.type === 1) ; else if (node.type === 3 && node.isComment) ; else {
            return genText(node)
        }
    }

    function genText (text) {
        // return ("_v(" + (transformSpecialNewlines(JSON.stringify(text.text))) + ")")
        return `_v(${text.type === 2 ? text.expression: transformSpecialNewlines(JSON.stringify(text.text))})`
    }

    function transformSpecialNewlines (text) {
        return text
    }

    const createCompiler = createCompilerCreator(function baseCompile (template, options) {
        const ast = parse(template.trim(), options);
        console.log('gsdast', ast);
        if (options.optimize !== false) ;
        const code = generate(ast, options);
        console.log('gsdcode', code);
        return {
            ast,
            render: code.render,
            staticRenderFns: code.staticRenderFns
        }
    });

    const isUnaryTag = makeMap(
        'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
        'link,meta,param,source,track,wbr'
    );

    function getAndRemoveAttr (el, name, removeFromMap){
        let val;
        if ((val = el.attrsMap[name]) != null) ;
        return val
    }

    function genData$1 (el) {
        console.log('gsdel', el);
        let data = '';
        if (el.staticClass) {
            data += `staticClass:${el.staticClass},`;
        }
        return data
    }

    function transformNode (el, options) {
        const staticClass = getAndRemoveAttr(el, 'class');
        console.log('gsdstaticClass', staticClass);
        if (staticClass) {
            el.staticClass = JSON.stringify(staticClass);
        }
    }

    var klass = {
        transformNode,
        genData: genData$1
    };

    var modules$1 = [
        klass
    ];

    const baseOptions = {
        modules: modules$1,
        expectHTML: true,
        isUnaryTag
    };

    const { compile, compileToFunctions } = createCompiler(baseOptions);

    let div;
    function getShouldDecode (href) {
        div = div || document.createElement('div');
        div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`;
        return div.innerHTML.indexOf('&#10;') > 0
    }

    const shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
    const shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

    const idToTemplate = cached(id => {
        const el = query(id);
        return el && el.innerHTML
    });

    const mount = Vue.prototype.$mount;
    Vue.prototype.$mount = function (el, hydrating) {
        el = el && query(el);
        console.log('gsdel', el);
        if (el === document.body || el === document.documentElement) { // vue需要不能挂载在body或者html上面
            warn(
                `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
            );
            return this
        }
        const options = this.$options;
        if (!options.render) { // 只有在没有传入render的时候才考虑使用template
            let template = options.template;
            if (template) { // template几种不同的传入方式处理
                if (typeof template === 'string') {
                    if (template.charAt(0) === '#') {
                        template = idToTemplate(template);
                        if (!template) {
                            warn(
                                `Template element not found or is empty: ${options.template}`,
                                this
                            );
                        }
                    }
                } else if (template.nodeType) {
                    template = template.innerHTML;
                } else {
                    return this
                }
            }else if(el){ // template没有传入的时候通过el自己去获取
                template = getOuterHTML(el);
            }
            console.log('gsdtemplate', template);
            if (template) {
                /*// TODO
                let render = function(createElement) {
                    // return createElement(('div',{attrs:{"id":"app"}},[createElement('h2', 'bcd'), createElement('aaa')],1))
                    return createElement('div', [createElement('h1', 'aaa111'), createElement('aaabbb')])
                }*/
                const { render, staticRenderFns } = compileToFunctions(template, {
                    shouldDecodeNewlines,
                    shouldDecodeNewlinesForHref,
                    delimiters: options.delimiters,
                }, this);
                console.log('gsdrender2', render);
                options.render = render;
            }
        }
        mount.call(this, el, hydrating);
    };

    function getOuterHTML (el) {
        if (el.outerHTML) { // 通过id拿到的整个标签
            return el.outerHTML
        }
    }

    return Vue;

})));
