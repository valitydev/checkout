import getTag from './get-tag';
import isObjectLike from './is-object-like';

/**
 * Checks if value is classified as a Number primitive or object.
 *
 * Note: To exclude Infinity, -Infinity, and NaN, which are classified as numbers, use the _.isFinite method.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
function isNumber(value?: any): value is number {
    return typeof value === 'number' || (isObjectLike(value) && getTag(value) == '[object Number]');
}

export default isNumber;
