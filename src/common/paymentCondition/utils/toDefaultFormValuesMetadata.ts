import { ServiceProviderMetadataField, ServiceProviderMetadataForm } from '../../backend/payments';
import { TerminalValues } from '../../paymentMgmt';
import { createRegExpForMetaPattern, isNil, isString } from '../../utils';

const applyReplacePattern = <T>(rawValue: T, pattern?: string, replaceValue?: string): string | T => {
    if (!isNil(pattern) && isString(rawValue)) {
        const regExp = new RegExp(pattern, 'g');
        return rawValue.replace(regExp, replaceValue ?? '');
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
        const appliedValue = applyReplacePattern(value, formField.replaceValuePattern, formField.replaceValue);
        if (formField.pattern && !createRegExpForMetaPattern(formField.pattern).test(appliedValue)) {
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
