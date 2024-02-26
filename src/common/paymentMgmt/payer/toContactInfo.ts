import { ContactInfo } from 'checkout/backend';

import { isNil, replaceSpaces } from '../../utils';
import { StartPaymentPayload } from '../types';

const mapFrom = (obj: { email?: string; phoneNumber?: string }, targetKeys = ['email', 'phoneNumber']): ContactInfo => {
    const defaultResult = {} as ContactInfo;
    if (isNil(obj)) {
        return defaultResult;
    }
    return targetKeys.reduce((acc, targetKey) => {
        const val = obj[targetKey];
        if (isNil(val)) {
            return acc;
        }
        return {
            ...acc,
            [targetKey]: replaceSpaces(val),
        };
    }, defaultResult);
};

const replaceSpacesFromObjectValues = (obj) => {
    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (typeof value === 'string') {
            obj[key] = replaceSpaces(value);
        } else if (typeof value === 'object' && value !== null) {
            replaceSpacesFromObjectValues(value);
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (typeof item === 'string') {
                    value[index] = replaceSpaces(item);
                } else if (typeof item === 'object' && item !== null) {
                    replaceSpacesFromObjectValues(item);
                }
            });
        }
    });
    return obj;
};

export const toContactInfo = ({ methodName, values }: StartPaymentPayload): ContactInfo => {
    const fromContactInfo = isNil(values?.contactInfo)
        ? {}
        : // TODO: Delete this function once space removal has been implemented for the phoneNumber field.
          replaceSpacesFromObjectValues(values?.contactInfo);
    switch (methodName) {
        case 'PaymentTerminal':
            const fromMetadata = mapFrom(values?.metadata);
            if (!isNil(fromMetadata)) {
                /*
                    Implement a check for this case's usage (e.g., Sentry logging).
                    If unused, eliminate retrieval of contact info from metadata.
                */
            }
            return {
                ...fromContactInfo,
                ...fromMetadata,
            };
        case 'BankCard':
            return {
                ...fromContactInfo,
            };
    }
};
