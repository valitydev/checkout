import { isString } from '../../../common/utils';

const getString = (userString: any): string => {
    let result = null;
    if (isString(userString)) {
        const trimmed = userString.trim();
        if (trimmed !== '') {
            result = trimmed;
        }
    }
    return result;
};

export const resolveString = (userString: any): string => {
    if (!userString) {
        return null;
    }
    return getString(userString);
};
