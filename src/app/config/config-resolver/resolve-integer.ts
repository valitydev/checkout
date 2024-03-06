import { isNumber, isString, toNumber } from '../../../common/utils';

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

export const resolveInteger = (userInteger: any): number | null => {
    if (!userInteger) {
        return null;
    }
    return getInteger(userInteger);
};
