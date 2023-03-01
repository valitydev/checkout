import isNil from 'lodash-es/isNil';
import isString from 'lodash-es/isString';

import { ServiceProviderMetadataField } from 'checkout/backend';
import { PaymentTerminalFormValues } from 'checkout/state';

const applyReplacePattern = <T>(rawValue: T, pattern?: string, replaceValue = ''): string | T => {
    if (!isNil(pattern) && isString(rawValue)) {
        const regExp = new RegExp(pattern, 'g');
        return rawValue.replaceAll(regExp, replaceValue);
    }
    return rawValue;
};

export const prepareFormValues = (
    form: ServiceProviderMetadataField[],
    terminalFormValues: object
): Partial<PaymentTerminalFormValues> => ({
    metadata: form.reduce((acc, formField) => {
        const value = terminalFormValues[formField.name];
        if (isNil(value)) {
            return acc;
        }
        const appliedValue = applyReplacePattern(value, formField.replaceValuePattern);
        if (formField.pattern && !new RegExp(formField.pattern).test(appliedValue)) {
            return acc;
        }
        return {
            ...acc,
            [formField.name]: appliedValue
        };
    }, {})
});
