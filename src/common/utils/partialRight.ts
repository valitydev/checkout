export const partialRight =
    (func, ...cachedArgs) =>
    (...args) =>
        func(...args, ...cachedArgs);
