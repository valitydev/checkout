interface Dictionary<T> {
    [index: string]: T;
}

function baseAssignValue(object, key, value) {
    if (key == '__proto__') {
        Object.defineProperty(object, key, {
            configurable: true,
            enumerable: true,
            value: value,
            writable: true,
        });
    } else {
        object[key] = value;
    }
}

/**
 * Creates an object composed of keys generated from the results of running each element of collection through
 * iteratee. The corresponding value of each key is an array of the elements responsible for generating the
 * key. The iteratee is invoked with one argument: (value).
 *
 * @param collection The collection to iterate over.
 * @param {String} The iteratee to transform keys.
 * @return Returns the composed aggregate object.
 */
function groupBy<T>(collection: T[] | null | undefined, iteratee: string): Dictionary<T[]> {
    return collection.reduce((result, value, key) => {
        key = value[iteratee];
        if (Object.prototype.hasOwnProperty.call(result, key)) {
            result[key].push(value);
        } else {
            baseAssignValue(result, key, [value]);
        }
        return result;
    }, {});
}

export default groupBy;
