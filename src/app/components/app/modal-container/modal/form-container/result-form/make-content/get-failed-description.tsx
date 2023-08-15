import { LogicError } from 'checkout/backend';
import { Locale } from 'checkout/locale';

const getDescription = (l: Locale, e: LogicError): string => {
    const result = l[e.code] ? l[e.code] : e.code;
    if (e.message) {
        return result ? result.concat(`.\n${e.message}`) : e.message;
    } else {
        return result;
    }
};

export const getFailedDescription = (l: Locale, e: LogicError): string => {
    if (!e && !e.code) {
        return;
    }
    return getDescription(l, e);
};
