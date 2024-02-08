import { ServiceProviderMetadataField, ServiceProviderMetadataForm } from 'checkout/backend';

import { TerminalValues } from '../../paymentMgmt';
import { isNil, isString } from '../../utils';

const applyReplacePattern = <T>(rawValue: T, pattern?: string, replaceValue = ''): string | T => {
    if (!isNil(pattern) && isString(rawValue)) {
        const regExp = new RegExp(pattern, 'g');
        return rawValue.replace(regExp, replaceValue);
    }
    return rawValue;
};

export const prepareFormValues = (
    form: ServiceProviderMetadataField[],
    terminalFormValues: object,
): Partial<TerminalValues> => ({
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
            [formField.name]: appliedValue,
        };
    }, {}),
});

export const toDefaultFormValuesMetadata = (terminalFormValues: object, form: ServiceProviderMetadataForm) => {
    if (isNil(terminalFormValues) || isNil(form)) return null;
    const { metadata } = prepareFormValues(form, terminalFormValues);
    return metadata;
};
