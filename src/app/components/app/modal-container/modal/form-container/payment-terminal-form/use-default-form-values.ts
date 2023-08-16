import { useMemo } from 'react';

import { ServiceProviderMetadataField, ServiceProviderMetadataForm } from 'checkout/backend';
import { InitConfig } from 'checkout/config';
import { PaymentTerminalFormValues } from 'checkout/hooks';
import isNil from 'checkout/utils/is-nil';
import isString from 'checkout/utils/is-string';

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
            [formField.name]: appliedValue,
        };
    }, {}),
});

const toDefaultFormValuesMetadata = (terminalFormValues: object, form: ServiceProviderMetadataForm) => {
    if (isNil(terminalFormValues) || isNil(form)) return null;
    const { metadata } = prepareFormValues(form, terminalFormValues);
    return metadata;
};

const toDefaultFormValues = (initConfig: InitConfig, form: ServiceProviderMetadataForm) => {
    const email = initConfig?.email;
    const phoneNumber = initConfig?.phoneNumber;
    const terminalFormValues = initConfig?.terminalFormValues;
    return {
        email,
        phoneNumber,
        metadata: toDefaultFormValuesMetadata(terminalFormValues, form),
    };
};

export const useDefaultFormValues = (initConfig: InitConfig, form: ServiceProviderMetadataForm) =>
    useMemo(() => toDefaultFormValues(initConfig, form), [initConfig, form]);
