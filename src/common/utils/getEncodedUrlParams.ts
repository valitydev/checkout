import { splitByFirst } from './splitByFirst';

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
