import getTag from './getTag';
import isObjectLike from './isObjectLike';

/**
 * Checks if value is classified as a Number primitive or object.
 *
 * Note: To exclude Infinity, -Infinity, and NaN, which are classified as numbers, use the _.isFinite method.
 *
 * @param value The value to check.
 * @return Returns true if value is correctly classified, else false.
 */
export function isNumber(value?: any): value is number {
    return typeof value === 'number' || (isObjectLike(value) && getTag(value) == '[object Number]');
}
