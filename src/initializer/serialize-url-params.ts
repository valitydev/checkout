export const serializeUrlParams = (params: { [name: string]: any }): string => {
    const urlParams: string[] = [];
    for (const prop in params) {
        if (Object.prototype.hasOwnProperty.call(params, prop)) {
            let value = params[prop];
            if (typeof value === 'function' || value === undefined || value === null) {
                continue;
            }
            if (typeof value === 'object') {
                try {
                    value = JSON.stringify(value);
                } catch (e) {
                    console.error(e);
                    continue;
                }
            }
            urlParams.push(`${prop}=${encodeURIComponent(value)}`);
        }
    }
    return urlParams.join('&');
};
