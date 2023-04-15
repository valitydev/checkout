import getTag from './get-tag';
import isObjectLike from './is-object-like';

/**
 * Checks if `value` is classified as a boolean primitive or object.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
 * @example
 *
 * isBoolean(false)
 * // => true
 *
 * isBoolean(null)
 * // => false
 */
function isBoolean(value?: any): value is boolean {
    return value === true || value === false || (isObjectLike(value) && getTag(value) == '[object Boolean]');
}

export default isBoolean;
