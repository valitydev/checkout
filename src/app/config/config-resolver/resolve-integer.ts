import toNumber from 'checkout/utils/to-number';
import isNumber from 'checkout/utils/is-number';
import isString from 'checkout/utils/is-string';
import { getMessageInvalidValue } from '../../log-messages';

const getFromNumber = (userInteger: number): number | null => (Number.isInteger(userInteger) ? userInteger : undefined);

const getFromString = (userInteger: string): number | null => getFromNumber(toNumber(userInteger));

const getInteger = (userInteger: any) => {
    if (!userInteger) {
        return null;
    }
    let result = null;
    if (isNumber(userInteger)) {
        result = getFromNumber(userInteger);
    } else if (isString(userInteger)) {
        result = getFromString(userInteger);
    }
    return result;
};

const log = (userInteger: any, fieldName: string) =>
    console.warn(getMessageInvalidValue(fieldName, userInteger, 'Value should be positive integer.'));

export const resolveInteger = (userInteger: any, fieldName: string): number | null => {
    if (!userInteger) {
        return null;
    }
    const result = getInteger(userInteger);
    if (!result) {
        log(userInteger, fieldName);
    }
    return result;
};
