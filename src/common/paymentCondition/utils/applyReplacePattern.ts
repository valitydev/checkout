import { isNil, isString } from '../../utils';

export const applyReplacePattern = <T>(rawValue: T, pattern?: string, replaceValue?: string): string | T => {
    if (!isNil(pattern) && isString(rawValue) && pattern !== '') {
        const regExp = new RegExp(pattern, 'g');
        return rawValue.replace(regExp, replaceValue ?? '');
    }
    return rawValue;
};
