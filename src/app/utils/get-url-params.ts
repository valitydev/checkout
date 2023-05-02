import { splitByFirst } from './split-by-first';

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

export const getEncodedUrlParams = (url: string): Record<string, string> => {
    const params = {};
    if (url && typeof url === 'string') {
        const urlParts = splitByFirst(url, '?');
        const paramsStr = urlParts[1];
        if (paramsStr) {
            const paramsPartsStr = paramsStr.split('&');
            for (const paramStr of paramsPartsStr) {
                const [name, value] = splitByFirst(paramStr, '=') as [string, string | undefined];
                params[name] = value;
            }
        }
    }
    return params;
};

export const getUrlParams = (url: string): URLParams =>
    Object.entries(getEncodedUrlParams(url)).reduce(
        (acc, [name, value]) => ({
            ...acc,
            [decodeURIComponentWithLogError(name)]: parseValue(decodeURIComponentWithLogError(value))
        }),
        {}
    );
