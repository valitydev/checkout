interface Dictionary<T> {
    [index: string]: T;
}

function baseAssignValue<T extends object>(object: T, key: string, value: any): void {
    if (key === '__proto__') {
        Object.defineProperty(object, key, {
            configurable: true,
            enumerable: true,
            value: value,
            writable: true,
        });
    } else {
        object[key as keyof T] = value;
    }
}

/**
 * Creates an object composed of keys generated from the results of running each element of collection through
 * iteratee. The corresponding value of each key is an array of the elements responsible for generating the
 * key. The iteratee is invoked with one argument: (value).
 *
 * @param collection The collection to iterate over.
 * @param iteratee The key of the property to group by.
 * @return Returns the composed aggregate object.
 */
export const groupBy = <T extends Record<string, any>>(
    collection: T[] | null | undefined,
    iteratee: keyof T,
): Dictionary<T[]> => {
    if (!collection) {
        return {};
    }

    return collection.reduce((result: Dictionary<T[]>, value) => {
        const key = value[iteratee];
        if (Object.prototype.hasOwnProperty.call(result, key)) {
            result[key].push(value);
        } else {
            baseAssignValue(result, key, [value]);
        }
        return result;
    }, {});
};
