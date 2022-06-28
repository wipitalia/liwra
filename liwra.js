((global, factory) => {
    if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = factory();
    else global.liwra = factory();
})(this, () => { 'use strict';

// to update with future `Array.prototype`'s methods that return new arrays
const WRAPPED_ARRAY_METHODS = [
    'concat',
    'filter',
    'flat',
    'map',
    'slice',
];

const isArrayLike = v => (
    typeof v !== 'string' && 
    (typeof Node === 'undefined' || !(v instanceof Node)) &&
    typeof v[Symbol.iterator] === 'function'
);

const isIndex = (_, prop) => {
    try { return !isNaN(Number(prop)) }
    catch { return false }
}

const isFromArray = (target, prop) => {
    return typeof target[prop] !== 'undefined';
}

const isMethod = (target, prop) => {
    return typeof target[0][prop] === 'function';
}

const wrap = lst => {
    const unwrap = target => (idx, end) => {
        if (typeof idx === 'undefined') return target
        if (typeof end === 'undefined') {
            const nextItem = idx === -1 ? target.length : idx + 1;
            return target.slice(idx, nextItem)[0];
        }
        return target.slice(idx, end);
    }

    const get = (target, prop) => {
        if (prop === 'isWrapped') return true;
        if (prop === 'exists') return target.length !== 0;
        if (prop === 'unwrap') return unwrap(target);
        
        if (target.length === 0) return wrap(target);

        if (isIndex(target, prop)) return target[prop];

        if (isFromArray(target, prop)) {
            if (WRAPPED_ARRAY_METHODS.includes(prop)) {
                return (...args) => wrap(target[prop](...args));
            }
            if (typeof target[prop] === 'function') {
                return (...args) => target[prop](...args);
            }
            return target[prop];
        }

        if (isMethod(target, prop)) {
            return (...args) => wrap(target.map(v => {
                if (typeof v[prop] !== 'function') return undefined;
                return v[prop].apply(v, args);
            }));
        }

        // if is value
        return wrap(target.map(v => v[prop]));
    }

    const has = (target, prop) => {
        if (['isWrapped', 'exists', 'unwrap'].includes(prop)) return true;
        if (isIndex(target, prop) && prop in target) return true;
        if (isFromArray(target, prop)) return true;
        if (isMethod(target, prop)) return true;
        return prop in target[0];
    }

    const set = (target, prop, value) => {
        target.forEach(v => v[prop] = value);
        return true;
    }

    if (lst.isWrapped) return lst;
    return new Proxy(
        (isArrayLike(lst) ? [...lst] : [lst]).filter(v => v !== undefined),
        { get, set, has }
    )
}

const querySelect = (root, selector) => {
    if (typeof root === 'string' && typeof selector === 'undefined') {
        selector = root;
        root = document;
    }
    const res = wrap(root).querySelectorAll(selector)
        .reduce((r, nl) => [...r, ...nl], []);
    return wrap(res);
}

return Object.assign(wrap, {querySelect});

});
