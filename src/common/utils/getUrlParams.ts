import { getEncodedUrlParams } from './getEncodedUrlParams';

export interface URLParams {
    [param: string]: boolean | string | number | null | undefined;
}

const decodeURIComponentWithLogError = (value: string): string => {
    try {
        return decodeURIComponent(value);
    } catch (e) {
        console.error(e);
        return value;
    }
};

const parseValue = (value: string): URLParams[keyof URLParams] => {
    switch (value) {
        case 'true':
            return true;
        case 'false':
            return false;
        case 'undefined':
            return undefined;
        case 'null':
            return null;
        default:
            // Checking '+' character for skip phone number parsing to float
            if (value !== '' && !value.startsWith('+') && !isNaN(value as any)) {
                return parseFloat(value);
            }
            return value;
    }
};

export const getUrlParams = (url: string): URLParams =>
    Object.entries(getEncodedUrlParams(url)).reduce(
        (acc, [name, value]) => ({
            ...acc,
            [decodeURIComponentWithLogError(name)]: parseValue(decodeURIComponentWithLogError(value)),
        }),
        {},
    );
