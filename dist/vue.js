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

    /*export const no = (a, b, c) => {
        return (a === 'div' || a === 'h1')
    }*/ // TODO
    const no = (a, b, c) => false;

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

    function extend (to, _from) { // 合并，以from的优先级更高
        for (const key in _from) {
            to[key] = _from[key];
        }
        return to
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
    const UA = inBrowser && window.navigator.userAgent.toLowerCase();
    const isIE = UA && /msie|trident/.test(UA);
    const isEdge = UA && UA.indexOf('edge/') > 0;

    function isNative (Ctor) {
        return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
    }

    let _isServer;
    const isServerRendering = () => {
        _isServer = false; // TODO
        return _isServer
    };

    let warn = noop;
    let tip = noop;
    let generateComponentTrace = noop;
    let formatComponentName = noop;

    const hasConsole = typeof console !== 'undefined'; // 是否有console这个方法

    { // TODO
        warn = (msg, vm) => { // 代码异常情况的警告处理
            const trace = vm ? generateComponentTrace(vm) : '';
            if (config.warnHandler) ;else if(hasConsole && (!config.silent)){
                console.error(`[Vue warn]: ${msg}${trace}`);
            }
        };
        tip = (msg, vm) => {
            if (hasConsole && (!config.silent)) {
                console.warn(`[Vue tip]: ${msg}` + (
                    vm ? generateComponentTrace(vm) : ''
                ));
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
    }

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

    const isHTMLTag = makeMap(
        'html,body,base,head,link,meta,style,title,' +
        'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
        'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
        'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
        's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
        'embed,object,param,source,canvas,script,noscript,del,ins,' +
        'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
        'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
        'output,progress,select,textarea,' +
        'details,dialog,menu,menuitem,summary,' +
        'content,element,shadow,template,blockquote,iframe,tfoot'
    );

    const isSVG = makeMap(
        'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
        'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
        'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
        true
    );

    const isReservedTag = (tag) => {
        return isHTMLTag(tag) || isSVG(tag)
    };

    function getTagNamespace (tag) { // 获取标签名的命名空间
        if (isSVG(tag)) {
            return 'svg'
        }
        if (tag === 'math') {
            return 'math'
        }
    }

    const isPreTag = (tag) => tag === 'pre';

    const acceptValue = makeMap('input,textarea,option,select,progress');
    const mustUseProp = (tag, type, attr) => {
        return (
            (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
            (attr === 'selected' && tag === 'option') ||
            (attr === 'checked' && tag === 'input') ||
            (attr === 'muted' && tag === 'video')
        )
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

    function generateCodeFrame (source, start, end) {
        return 'generateCodeFrame:'+ start+':'+end
    }

    function createFunction (code, errors) {
        try {
            return new Function(code)
        } catch (err) {
            errors.push({ err, code });
            return noop
        }
    }

    function createCompileToFunctionFn (compile) {
        const cache = Object.create(null);
        return function compileToFunctions (template, options, vm) {
            options = extend({}, options);
            const warn$1 = options.warn || warn;
            delete options.warn;
            { // TODO
                try {
                    new Function('return 1'); // 是否允许将字符串当作代码执行
                } catch (e) {
                    if (e.toString().match(/unsafe-eval|CSP/)) {
                        warn$1(
                            'It seems you are using the standalone build of Vue.js in an ' +
                            'environment with Content Security Policy that prohibits unsafe-eval. ' +
                            'The template compiler cannot work in this environment. Consider ' +
                            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                            'templates into render functions.'
                        );
                    }
                }
            }
            const key = options.delimiters? String(options.delimiters) + template: template; //生成key
            if (cache[key]) {
                return cache[key]
            }
            const compiled = compile(template, options);
            compiled.tips = [{
                msg: '构建成功'
            }];
            { // TODO
                if (compiled.errors && compiled.errors.length) { // 编译失败的时候给出错误提示
                    if (options.outputSourceRange) {
                        compiled.errors.forEach(e => {
                            warn$1(`Error compiling template:\n\n${e.msg}\n\n` +
                                generateCodeFrame(template, e.start, e.end)
                                ,vm);
                        });
                    } else {
                        warn$1(`Error compiling template:\n\n${template}\n\n` +
                            compiled.errors.map(e => `- ${e}`).join('\n') + '\n'
                            , vm);
                    }
                }
                if (compiled.tips && compiled.tips.length) {
                    if (options.outputSourceRange) {
                        compiled.tips.forEach(e => tip(e.msg, vm));
                    } else {
                        compiled.tips.forEach(msg => tip(msg, vm));
                    }
                }
            }
            console.log('gsdcompileToFunctions');
            const res = {};
            const fnGenErrors = [];
            res.render = createFunction(compiled.render, fnGenErrors);
            res.staticRenderFns = {}; // TODO
            { // TODO
                if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
                    warn$1(
                        `Failed to generate render function:\n\n` +
                        fnGenErrors.map(({ err, code }) => `${err.toString()} in\n\n${code}\n`).join('\n'),
                        vm
                    );
                }
            }
            return (cache[key] = res)
        }
    }

    // 检测template里面有问题的表达式
    function detectErrors (ast, warn) {
    }

    function createCompilerCreator (baseCompile) {
        return function createCompiler (baseOptions) {
            function compile (template, options) {
                // 合并baseOptions和options
                const finalOptions = Object.create(baseOptions);
                const errors = [];
                const tips = [];
                let warn = (msg, range, tip) => {
                    (tip ? tips : errors).push(msg);
                };
                if (options) {
                    if (options.outputSourceRange) {
                        const leadingSpaceLength = template.match(/^\s*/)[0].length;
                        warn = (msg, range, tip) => {
                            const data = { msg };
                            if (range) {
                                if (range.start != null) {
                                    data.start = range.start + leadingSpaceLength;
                                }
                                if (range.end != null) {
                                    data.end = range.end + leadingSpaceLength;
                                }
                            }
                            (tip ? tips : errors).push(data);
                        };
                    }
                    // 合并modules
                    if (options.modules) {
                        finalOptions.modules =
                            (baseOptions.modules || []).concat(options.modules);
                    }
                    // 合并directives
                    if (options.directives) {
                        finalOptions.directives = extend(
                            Object.create(baseOptions.directives || null),
                            options.directives
                        );
                    }
                    for (var key in options) {
                        if (key !== 'modules' && key !== 'directives') {
                            finalOptions[key] = options[key];
                        }
                    }
                }
                finalOptions.warn = warn;
                // 执行baseCompile
                const compiled = baseCompile(template.trim(), finalOptions);
                detectErrors(compiled.ast);
                compiled.errors = errors;
                compiled.tips = tips;
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
        const expectHTML = options.expectHTML;
        const isUnaryTag = options.isUnaryTag || no;
        let index = 0;
        let last,lastTag;
        console.log('gsdhtml', html);
        while (html) {
            last = html;  // 在处理之前存储原来的html的值
            if (!lastTag || !isPlainTextElement(lastTag)) { // lastTag没有，或者lastTag不是script,style,textarea
                console.log('gsdaaa', lastTag);
                let textEnd = html.indexOf('<'); // 检索的<符号的位置
                if (textEnd === 0) { // <div></div>
                    if (comment.test(html)) {// 检测html是不是注释
                        const commentEnd = html.indexOf('-->'); // 找到注释的结尾
                        if (commentEnd >= 0) { // 如果注释有结尾
                            if (options.shouldKeepComment) { // 如果需要保存注释的话，调用comment方法
                                options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
                            }
                            advance(commentEnd + 3); // 跳过注释接着往下
                            continue
                        }
                    }
                    if (conditionalComment.test(html)) {  // 检测html是不是条件注释
                        const conditionalEnd = html.indexOf(']>'); // 找到条件注释的结尾
                        if (conditionalEnd >= 0) {// 如果条件注释有结尾，跳过条件注释接着往下
                            advance(conditionalEnd + 2);
                            continue
                        }
                    }
                    const doctypeMatch = html.match(doctype); // 检测html是不是<!DOCTYPE...
                    if (doctypeMatch) {  // 如果有<!DOCTYPE，跳过<!DOCTYPE接着往下
                        advance(doctypeMatch[0].length);
                        continue
                    } // 匹配到<!DOCTYPE...后的逻辑处理
                    const endTagMatch = html.match(endTag); // 匹配结束标签 />
                    if (endTagMatch) { // 如果匹配到结束标签做的逻辑
                        console.log('gsdendTagMatch', endTagMatch);
                        const curIndex = index;
                        advance(endTagMatch[0].length); // 调用了advance以后，index会指向一个新的开始的位置
                        parseEndTag(endTagMatch[1], curIndex, index); // 对结束标签里面的内容做具体的处理
                        continue
                    }
                    const startTagMatch = parseStartTag(); // 匹配开始标签
                    console.log(index, startTagMatch); // 匹配开始标签做的逻辑
                    if (startTagMatch) {
                        handleStartTag(startTagMatch);
                        continue
                    }
                } // 检索的<符号的位置===0
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
                } // 检索的<符号的位置>=0
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
            const start = html.match(startTagOpen); // 匹配类似<div
            if (start) {
                const match = {
                    tagName: start[1],
                    attrs: [],
                    start: index
                };
                advance(start[0].length); // 跳过开始标签的位置
                let end, attr; // <div class=''>
                while (!(end = html.match(startTagClose))  && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
                    attr.start = index;
                    advance(attr[0].length);
                    attr.end = index;
                    match.attrs.push(attr);
                    console.log('gsdmatch', match);
                }
                if (end) {
                    console.log('gsdend', end);
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
        function parseEndTag (tagName, start, end) { // <a></a><b><c><d></c></b>
            let pos, lowerCasedTagName;
            if (tagName) {
                lowerCasedTagName = tagName.toLowerCase(); // tagname转化为小写
                for (pos = stack.length - 1; pos >= 0; pos--) { // 得到pos, pos表示当前tagname在栈里面的位置
                    if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                        break
                    }
                }
            } else {
                pos = 0;
            }
            if (pos >= 0) { // 找到了tagname,或者没传入tagname
                for (let i = stack.length - 1; i >= pos; i--) {
                    if ((i > pos || !tagName) && options.warn) {  // <a><b><c><d></c>
                        options.warn(
                            `tag <${stack[i].tag}> has no matching end tag.`,
                            { start: stack[i].start, end: stack[i].end }
                        );
                    }
                    if (options.end) {
                        options.end(stack[i].tag, start, end);
                    }
                }
                stack.length = pos;
                lastTag = pos && stack[pos - 1].tag; // 栈顶元素的tag值
            } else if (lowerCasedTagName === 'br') {
                if (options.start) {
                    options.start(tagName, [], true, start, end);
                }
            } else if (lowerCasedTagName === 'p') { // TODO
                if (options.start) {
                    options.start(tagName, [], false, start, end);
                }
                if (options.end) {
                    options.end(tagName, start, end);
                }
            }
        }
    }

    function parseFilters (exp) {
        return exp // TODO
    }

    function baseWarn (msg, range) {
        console.error(`[Vue compiler]: ${msg}`);
    }
    function pluckModuleFunction(modules, key) {
        return modules
            ? modules.map(m => m[key]).filter(_ => _)
            : []
    }

    function getAndRemoveAttr (el,name, removeFromMap) { // 获取并删除attr
        let val;
        if ((val = el.attrsMap[name]) != null) {
            const list = el.attrsList;
            for (let i = 0, l = list.length; i < l; i++) {
                if (list[i].name === name) {
                    list.splice(i, 1);
                    break
                }
            }
            if (removeFromMap) {
                delete el.attrsMap[name];
            }
        }
        return val
    }

    function getBindingAttr (el, name, getStatic) {
        const dynamicValue =
            getAndRemoveAttr(el, ':' + name) ||
            getAndRemoveAttr(el, 'v-bind:' + name);
        if (dynamicValue != null) {
            return parseFilters(dynamicValue)
        } else if (getStatic !== false) {
            const staticValue = getAndRemoveAttr(el, name);
            if (staticValue != null) {
                return JSON.stringify(staticValue)
            }
        }
    }

    function addAttr (el, name, value, range, dynamic) {
        const attrs = dynamic? (el.dynamicAttrs || (el.dynamicAttrs = [])): (el.attrs || (el.attrs = []));
        attrs.push(rangeSetItem({ name, value, dynamic }, range));
        el.plain = false;
    }

    function rangeSetItem (item, range) {
        if (range) {
            if (range.start != null) {
                item.start = range.start;
            }
            if (range.end != null) {
                item.end = range.end;
            }
        }
        return item
    }

    function getRawBindingAttr (el, name){ // 从rawAttrsMap去取name的值
        return el.rawAttrsMap[':' + name] ||
            el.rawAttrsMap['v-bind:' + name] ||
            el.rawAttrsMap[name]
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
        let match, index, tokenValue;
        while ((match = tagRE.exec(text))) {
            index = match.index;
            console.log('gsdindex', index, lastIndex);
            if (index > lastIndex) {
                rawTokens.push(tokenValue = text.slice(lastIndex, index));
                tokens.push(JSON.stringify(tokenValue));
            }
            const exp = parseFilters(match[1].trim());
            tokens.push(`_s(${exp})`);
            rawTokens.push({ '@binding': exp });
            lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
            rawTokens.push(tokenValue = text.slice(lastIndex));
            tokens.push(JSON.stringify(tokenValue));
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

    //import he from 'he'

    const invalidAttributeRE = /[\s"'<>\/=]/;
    const lineBreakRE = /[\r\n]/; // 回车换行
    const whitespaceRE = /\s+/g; // 全局匹配空格

    // const decodeHTMLCached = cached(he.decode)
    const decodeHTMLCached = function (text) { // TODO
        return text
    };
    let warn$1;

    let transforms;
    let preTransforms;
    let postTransforms;
    let delimiters;

    let platformIsPreTag;
    let platformMustUseProp;
    let platformGetTagNamespace;

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
        element.plain = (
            !element.key &&
            !element.scopedSlots &&
            !element.attrsList.length
        );
        processSlotContent(element);
        for (let i = 0; i < transforms.length; i++) { // 根据transforms处理element,在closeElement里面调用的
            element = transforms[i](element, options) || element;
        }
        return element
    }
    function isForbiddenTag (el) { // 是否是一些禁止的tag
        return (
            el.tag === 'style' ||
            (el.tag === 'script' && (
                !el.attrsMap.type ||
                el.attrsMap.type === 'text/javascript'
            ))
        )
    }
    function parse (template, options) {
        warn$1 = options.warn || baseWarn;

        platformIsPreTag = options.isPreTag || no; // 判断是否是pre标签

        platformMustUseProp = options.mustUseProp || no;
        platformGetTagNamespace = options.getTagNamespace || no;
        const isReservedTag = options.isReservedTag || no;
        transforms = pluckModuleFunction(options.modules, 'transformNode');
        preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
        postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

        delimiters = options.delimiters;

        const stack = [];
        const preserveWhitespace = options.preserveWhitespace !== false; // 保留空格
        const whitespaceOption = options.whitespace;
        let root;
        let currentParent; // 当前的父节点
        let inVPre = false; // 是否标记了v-pre v-pre用于跳过这个元素和它子元素的编译过程，用于显示原本的Mustache语法
        let inPre = false;
        let warned = false;

        function warnOnce (msg, range) { // 多次只警告一次
            if (!warned) {
                warned = true;
                warn$1(msg, range);
            }
        }


        function closeElement (element) {// 关闭element // TODO
            trimEndingWhitespace(element);
            if (!inVPre && !element.processed) {
                element = processElement(element, options);
            }
            if (!stack.length && element !== root) { // 判断当前是否只有一个根节点
                if (root.if && (element.elseif || element.else)) {
                    {
                        checkRootConstraints(element);
                    }
                    addIfCondition(root, { // TODO
                        exp: element.elseif,
                        block: element
                    });
                } else { // TODO
                    warnOnce(
                        `Component template should contain exactly one root element. ` +
                        `If you are using v-if on multiple elements, ` +
                        `use v-else-if to chain them instead.`,
                        { start: element.start }
                    );
                }
            }
            if (currentParent && !element.forbidden) {
                if (element.elseif || element.else) {
                    processIfConditions(element, currentParent);
                } else {
                    if (element.slotScope) {
                        const name = element.slotTarget || '"default"'
                        ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
                    }
                }
            }
            element.children = element.children.filter(c => !c.slotScope); // 对children进行过滤，过滤掉包含slotScope
            trimEndingWhitespace(element);
            if (element.pre) {
                inVPre = false;
            }
            if (platformIsPreTag(element.tag)) {
                inPre = false;
            }
            for (let i = 0; i < postTransforms.length; i++) {
                postTransforms[i](element, options);
            }
        }

        function trimEndingWhitespace (el) { // 若当前元素不是pre元素，则删除元素尾部的空白文本节点
            if (!inPre) { // 如果不是pre标签
                let lastNode;
                while ((lastNode = el.children[el.children.length - 1]) && lastNode.type === 3 && lastNode.text === ' ') {
                    el.children.pop();
                }
            }
        }

        function checkRootConstraints (el) { // 校验检查，不要用slot、template做根节点，也不要用 v-for 属性，因为这些都可能产生多个根节点
            if (el.tag === 'slot' || el.tag === 'template') {
                warnOnce(
                    `Cannot use <${el.tag}> as component root element because it may ` +
                    'contain multiple nodes.',
                    { start: el.start }
                );
            }
            if (el.attrsMap.hasOwnProperty('v-for')) {
                warnOnce(
                    'Cannot use v-for on stateful component root element because ' +
                    'it renders multiple elements.',
                    el.rawAttrsMap['v-for']
                );
            }
        }
        parseHTML(template, {
            warn: warn$1, // 警告函数
            expectHTML: options.expectHTML,
            isUnaryTag: options.isUnaryTag, // 是否是一元标签
            canBeLeftOpenTag: options.canBeLeftOpenTag,
            shouldDecodeNewlines: options.shouldDecodeNewlines,
            shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
            shouldKeepComment: options.comments, // 是否保存注释
            outputSourceRange: options.outputSourceRange,
            start (tag, attrs, unary, start, end) {
                const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag); // 获取标签名的命名空间,如果currentParent有命名空间 继承父ns
                if (isIE && ns === 'svg') { // 在IE浏览器下处理svg bug
                    attrs = guardIESVGBug(attrs);
                }
                let element = createASTElement(tag, attrs, currentParent);
                if (ns) {
                    element.ns = ns;
                }
                { // TODO
                    if (options.outputSourceRange) {
                        element.start = start;
                        element.end = end;
                        element.rawAttrsMap = []; // TODO
                    }
                    attrs.forEach(attr => {
                        if (invalidAttributeRE.test(attr.name)) {
                            warn$1(
                                `Invalid dynamic argument expression: attribute names cannot contain ` +
                                `spaces, quotes, <, >, / or =.`,
                                {
                                    start: attr.start + attr.name.indexOf(`[`),
                                    end: attr.start + attr.name.length
                                }
                            );
                        }
                    });
                }
                if (isForbiddenTag(element) && !isServerRendering()) { // 判断生成的element是否是禁止标签
                    element.forbidden = true;
                    warn$1(
                        'Templates should only be responsible for mapping the state to the ' +
                        'UI. Avoid placing tags with side-effects in your templates, such as ' +
                        `<${tag}>` + ', as they will not be parsed.',
                        { start: element.start }
                    );
                }
                // 根据preTransforms处理element
                for (let i = 0; i < preTransforms.length; i++) {
                    element = preTransforms[i](element, options) || element;
                }
                if (!inVPre) { // 如果没有标记v-pre
                    processPre(element);
                    if (element.pre) {
                        inVPre = true;
                    }
                }
                if (platformIsPreTag(element.tag)) { // pre 元素可定义预格式化的文本。被包围在 pre 元素中的文本通常会保留空格和换行符
                    inPre = true;
                }
                if (inVPre) {
                    processRawAttrs(element);
                }else if(!element.processed){ // 没有v-pre 并且没有processed
                    processFor(element); // v-for
                    processIf(element); // v-if
                    processOnce(element); // v-once
                }
                if (!root) {
                    root = element;
                    { // TODO
                        checkRootConstraints(root);
                    }
                }
                if (!unary) {
                    currentParent = element;
                    stack.push(element);
                }else {
                    closeElement(element);
                }
            },
            end (tag, start, end) {
                const element = stack[stack.length - 1];
                stack.length -= 1;
                   // <div class='a'><div class='b'>fdasfdas</div></div>
                currentParent = stack[stack.length - 1];
                if (options.outputSourceRange) {
                    element.end = end;
                }
                closeElement(element);
                console.log('gsdelement', element);
            },
            chars (text, start, end) {
                if (!currentParent) {
                    { // TODO
                        if (text === template) {
                            warnOnce(
                                'Component template requires a root element, rather than just text.',
                                { start }
                            );
                        }else if((text = text.trim())) {
                            warnOnce(
                                `text "${text}" outside root element will be ignored.`,
                                { start }
                            );
                        }
                    }
                    return
                }
                if (isIE && // 解决IE的bug 由于placeholder是 html5的新属性，可想而知，仅支持html5的浏览器才支持placeholder，目前最新的firefox、chrome、safari以及ie10都支持，ie6到ie9都不支持。
                    currentParent.tag === 'textarea' &&
                    currentParent.attrsMap.placeholder === text
                ) {
                    return
                }
                const children = currentParent.children;
                if (inPre || text.trim()) { // 是pre或者text不为空
                    text = isTextTag(currentParent) ? text: decodeHTMLCached(text);
                } else if (!children.length) {
                    text = '';
                } else if (whitespaceOption) {
                    if (whitespaceOption === 'condense') {
                        text = lineBreakRE.test(text) ? '' : ' ';
                    } else {
                        text = ' ';
                    }
                } else {
                    text = preserveWhitespace ? ' ' : '';
                }
                if (text) {
                    if (!inPre && whitespaceOption === 'condense') {
                        text = text.replace(whitespaceRE, ' ');
                    }
                    let res;
                    let child;
                    // 不是--vpre 并且text不为空并且parseText有结果
                    if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) { // TODO
                        console.log('gsdres', res);
                        child = { // 表达式类型的
                            type: 2,
                            expression: res.expression,
                            tokens: res.tokens,
                            text
                        };
                    }else if(text !== ' ' || !children.length || children[children.length - 1].text !== ' ') { //text不为空或者children为空或者。。。     // TODO
                        child = { // 普通的文本节点
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
            comment (text, start, end) { // 对一些注释的处理
                if (currentParent) {
                    const child = { // 注释
                        type: 3,
                        text,
                        isComment: true
                    };
                    if (options.outputSourceRange) {
                        child.start = start;
                        child.end = end;
                    }
                    currentParent.children.push(child);
                }
            }
        });
        return root
    }

    function makeAttrsMap(attrs) {
        const map = {};
        for (let i = 0, l = attrs.length; i < l; i++) {
            if (
                map[attrs[i].name] && !isIE && !isEdge
            ) {
                warn$1('duplicate attribute: ' + attrs[i].name, attrs[i]);
            }
            map[attrs[i].name] = attrs[i].value;
        }
        return map
    }

    function guardIESVGBug (attrs) { // 处理IE svg的bug
        return attrs
    }

    function processPre (el) {
        if (getAndRemoveAttr(el, 'v-pre') != null) {
            el.pre = true;
        }
    }

    function processRawAttrs (el) { // 存在v-pre的时候，遍历当前所有的attrsList，依次保存到e.attrs上面
        const list = el.attrsList;
        const len = list.length;
        if (len) {
            const attrs = el.attrs = new Array(len);
            for (let i = 0; i < len; i++) {
                attrs[i] = {
                    name: list[i].name,
                    value: JSON.stringify(list[i].value)
                };
                if (list[i].start != null) {
                    attrs[i].start = list[i].start;
                    attrs[i].end = list[i].end;
                }
            }
        } else if (!el.pre) ;
    }

    function processFor (el) { // 处理v-for
        let exp;
        if ((exp = getAndRemoveAttr(el, 'v-for'))) {
            const res = parseFor(exp);
            if (res) ;else { // TODO
                warn$1(
                    `Invalid v-for expression: ${exp}`,
                    el.rawAttrsMap['v-for']
                );
            }
        }
    }

    function processIf (el) {
        const exp = getAndRemoveAttr(el, 'v-if');
        if (exp) {
            el.if = exp;
            addIfCondition(el, {
                exp: exp,
                block: el
            });
        } else {
            if (getAndRemoveAttr(el, 'v-else') != null) {
                el.else = true;
            }
            const elseif = getAndRemoveAttr(el, 'v-else-if');
            if (elseif) {
                el.elseif = elseif;
            }
        }
    }

    function processOnce (el) {
        const once = getAndRemoveAttr(el, 'v-once');
        if (once != null) {
            el.once = true; //子组件中分别加入v-once，当每次切换组件效果时，不再需要每次都经过 创建——销毁 的过程，而是在内存中直接取用上一次使用过的组件的内容，可有效提高静态内容的展示效率
        }
    }

    function parseFor (exp) {
        return exp
    }

    function addIfCondition (el, condition) {
        if (!el.ifConditions) {
            el.ifConditions = [];
        }
        el.ifConditions.push(condition);
    }

    function isTextTag (el) {
        return el.tag === 'script' || el.tag === 'style'
    }

    function processSlotContent(el) {
        let slotScope;
        if (el.tag === 'template') {
            slotScope = getAndRemoveAttr(el, 'scope');
            if (slotScope) {
                warn$1(
                    `the "scope" attribute for scoped slots have been deprecated and ` +
                    `replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ` +
                    `can also be used on plain elements in addition to <template> to ` +
                    `denote scoped slots.`,
                    el.rawAttrsMap['scope'],
                    true
                );
            }
            el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
        } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
            if (el.attrsMap['v-for']) {
                warn$1(
                    `Ambiguous combined usage of slot-scope and v-for on <${el.tag}> ` +
                    `(v-for takes higher priority). Use a wrapper <template> for the ` +
                    `scoped slot to make it clearer.`,
                    el.rawAttrsMap['slot-scope'],
                    true
                );
            }
            el.slotScope = slotScope;
        }
        const slotTarget = getBindingAttr(el, 'slot');
        if (slotTarget) {
            el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
            el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
            if (el.tag !== 'template' && !el.slotScope) {
                addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
            }
        }
    }

    function processIfConditions (el, parent) { // elseif 和else的时候触发
        const prev = findPrevElement(parent.children);
        if (prev && prev.if) {
            addIfCondition(prev, { // TODO
                exp: el.elseif,
                block: el
            });
        } else { // TODO
            warn$1(
                `v-${el.elseif ? ('else-if="' + el.elseif + '"') : 'else'} ` +
                `used on element <${el.tag}> without corresponding v-if.`,
                el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']
            );
        }
    }

    function findPrevElement (children) { // 找到上一个元素
        let i = children.length;
        while (i--) {
            if (children[i].type === 1) {
                return children[i]
            } else {
                if (children[i].text !== ' ') {
                    warn$1(
                        `text "${children[i].text.trim()}" between v-if and v-else(-if) ` +
                        `will be ignored.`,
                        children[i]
                    );
                    children.pop();
                }
            }
        }
    }

    var baseDirectives = {

    };

    class CodegenState {
        constructor (options) {
            this.options = options; // finalOptionss，经过合并后的
            this.warn = options.warn || baseWarn;
            this.transforms = pluckModuleFunction(options.modules, 'transformCode');
            this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
            this.directives = extend(extend({}, baseDirectives), options.directives);
            const isReservedTag = options.isReservedTag || no; // 是否是保留标签
            this.maybeComponent = (el) => !!el.component || !isReservedTag(el.tag);  // 是否是组件
            this.staticRenderFns = [];
            console.log('gsddataGenFns', this.dataGenFns);
        }
    }

    function generate (ast, options) {
        const state = new CodegenState(options);
        const code = ast ? genElement(ast, state) : '_c("div")';
        return {
            render: `with(this){return ${code}}`, // TODO
            staticRenderFns: state.staticRenderFns
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
        // 通过template拿到ast
        const ast = parse(template.trim(), options);
        console.log('gsdast', ast);
        // 静态化
        if (options.optimize !== false) ;
        // AST转换为代码字符串'function(){}
        // 比如：with(this){return _c('div',{staticClass:"container"},[_v("\n        ")])}
        const code = generate(ast, options);
        console.log('gsdcode', code);
        return {
            ast,
            render: code.render,
            staticRenderFns: code.staticRenderFns
        }
    });

    const isUnaryTag = makeMap( // 是否是一元标签
        'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
        'link,meta,param,source,track,wbr'
    );

    const canBeLeftOpenTag = makeMap( // 以下标签如果只写了左侧的tag，浏览器会自动补全
        'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
    );

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

    var directives = {

    };

    const baseOptions = {
        modules: modules$1,
        directives,
        expectHTML: true,
        isReservedTag, // 是否是保留标签
        isUnaryTag, // 一元标签
        canBeLeftOpenTag, // 以下标签如果只写了左侧的tag，浏览器会自动补全
        mustUseProp, // TODO
        getTagNamespace,  // 获取标签名的命名空间
        isPreTag // 是否是pre标签
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
                    outputSourceRange: true,
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
        }else {
            const container = document.createElement('div');
            container.appendChild(el.cloneNode(true));
            return container.innerHTML
        }
    }

    Vue.compile = compileToFunctions; // template变成render

    return Vue;

})));
