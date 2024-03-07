import { isBoolean, isString } from '../../../common/utils';

const toBoolean = (str: string): boolean => {
    switch (str) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return null;
    }
};

const getBoolean = (userBoolean: any): boolean | null => {
    let result = null;
    if (isBoolean(userBoolean)) {
        result = userBoolean;
    } else if (isString(userBoolean)) {
        result = toBoolean(userBoolean);
    }
    return result;
};

export const resolveBoolean = (userBoolean: any): boolean | null => {
    if (userBoolean === undefined) {
        return null;
    }
    return getBoolean(userBoolean);
};
