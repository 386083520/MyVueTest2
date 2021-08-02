(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

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

    var config = ({
        isReservedTag: no,
        parsePlatformTagName: identity,
        optionMergeStrategies: Object.create(null)
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

    class Watcher {
        constructor (vm, expOrFn, cb, options, isRenderWatcher) {
            console.log('gsdvm', vm);
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
        console.log(vm._update(vm._render(), hydrating));
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

    function query (el) {
        if (typeof el === 'string') {
            const selected = document.querySelector(el);
            if (!selected) {
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

    const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

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

    let warn;

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
        warn = options.warn || baseWarn;
        transforms = pluckModuleFunction(options.modules, 'transformNode');
        function closeElement (element) {
            if ( !element.processed) {
                element = processElement(element, options);
            }
        }
        parseHTML(template, {
            warn,
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

    const mount = Vue.prototype.$mount;
    Vue.prototype.$mount = function (el, hydrating) {
        el = el && query(el);
        const options = this.$options;
        /*if(options._componentTag) {
            let render = function(createElement) {
                return createElement('div', 'aaab222')
            }
            options.render = render
        }*/
        if (!options.render) {
            let template = options.template;
            if (template) {
                if (typeof template === 'string') {
                    if (template.charAt(0) === '#') ;
                } else if (template.nodeType) ; else {
                    return this
                }
            }
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

    return Vue;

})));
