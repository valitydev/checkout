import { InitContextContactInfo } from 'src/common/paymentModel/types';

import { ContactInfo } from 'checkout/backend';

import { isNil, replaceSpaces } from '../../utils';
import { CommonStartPaymentValues } from '../types';

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

export const toContactInfo = (
    initContextContactInfo: InitContextContactInfo,
    payload: CommonStartPaymentValues,
): ContactInfo => {
    const fromFormValues = mapFrom(payload);
    const fromMetadata = {}; // TODO implement getting contact info from PaymentTerminal metadata
    // const fromMetadata = mapFrom((payload as PaymentTerminalFormValues)?.metadata);
    const fromInitConfig = mapFrom(initContextContactInfo);
    const byPriority = {
        ...fromFormValues,
        ...fromMetadata,
        ...fromInitConfig,
    };
    return byPriority;
};
