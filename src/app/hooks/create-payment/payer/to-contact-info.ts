import replaceSpaces from 'checkout/utils/replace-spaces';
import isNil from 'checkout/utils/is-nil';
import { PayableFormValues, PaymentTerminalFormValues } from 'checkout/hooks';
import { ContactInfo } from 'checkout/backend';

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
    initConfig: { email: string; phoneNumber: string },
    formValues: PayableFormValues,
): ContactInfo => {
    const fromFormValues = mapFrom(formValues);
    const fromMetadata = mapFrom((formValues as PaymentTerminalFormValues)?.metadata);
    const fromInitConfig = mapFrom(initConfig);
    const byPriority = {
        ...fromFormValues,
        ...fromMetadata,
        ...fromInitConfig,
    };
    return byPriority;
};
