import isNil from 'lodash-es/isNil';

export const isSafetyUrl = (url: string): boolean => {
    if (isNil(url)) {
        return false;
    }
    return /^(http(s)?):\/\/.*$/.test(url);
};
