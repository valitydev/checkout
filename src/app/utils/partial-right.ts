const partialRight =
    (func, ...cachedArgs) =>
    (...args) =>
        func(...args, ...cachedArgs);

export default partialRight;
