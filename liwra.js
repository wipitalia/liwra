(() => {

const WRAPPED_ARRAY_METHODS = [
    "concat",
    "filter",
    "flat",
    "map",
    "slice",
];

const isArrayLike = v => (
    typeof v !== "string" && 
    !(v instanceof Node) &&
    typeof v[Symbol.iterator] === "function"
);

const wrap = lst => {
    const isIndex = (_, prop) => {
        try { return !isNaN(Number(prop)) }
        catch { return false }
    }

    const isMethod = (target, prop) => target.reduce((r, v) => {
        return typeof v[prop] === "function" || r;
    }, false);

    const isValue = (target, prop) => target.reduce((r, v) => {
        return typeof v[prop] !== "undefined" || r;
    }, false);

    const isFromArray = (target, prop) => {
        return typeof target[prop] !== "undefined";
    }

    const get = (target, prop) => {
        if (prop === "isWrapped") return true;
        if (prop === "unwrap") return () => target;

        if (isIndex(target, prop)) {
            return target[prop];
        }

        if (isFromArray(target, prop)) {
            if (WRAPPED_ARRAY_METHODS.includes(prop)) {
                return (...args) => wrap(target[prop](...args));
            }
            if (typeof target[prop] === "function") {
                return (...args) => target[prop](...args);
            }
            return target[prop];
        }

        if (isMethod(target, prop)) {
            return (...args) => {
                return wrap(target.map(v => v[prop].apply(v, args)));
            }
        }

        if (isValue(target, prop)) {
            return wrap(target.map(v => v[prop]));
        }
    }

    const set = (target, prop, value) => {
        if (isIndex(target, prop)) {
            target[prop] = value;
        }

        target.forEach(v => v[prop] = value);
    }

    if (lst.isWrapped) return lst;
    if (isArrayLike(lst)) return new Proxy([...lst], {get, set});
    return new Proxy([lst], {get, set});
}

const querySelect = (root, selector) => {
    if (typeof root === "string" && typeof selector === "undefined") {
        selector = root;
        root = document;
    }
    const res = wrap(root).querySelectorAll(selector)
        .reduce((r, nl) => [...r, ...nl], []);
    return wrap(res);
}

// exports
window.liwra = Object.assign(wrap, {querySelect});

})();
