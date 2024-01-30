import { useMemo } from 'react';

import { ServiceProviderMetadataField, ServiceProviderMetadataForm } from 'checkout/backend';

import { InitContextContactInfo } from '../../../../common/paymentModel';
import { isNil, isString } from '../../../../common/utils';
import { MetadataFormInputs } from '../types';

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
): Partial<MetadataFormInputs> => ({
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

const toDefaultFormValues = (
    contactInfo: InitContextContactInfo,
    terminalFormValues: object,
    form: ServiceProviderMetadataForm,
) => {
    const email = contactInfo?.email;
    const phoneNumber = contactInfo?.phoneNumber;
    return {
        email,
        phoneNumber,
        metadata: toDefaultFormValuesMetadata(terminalFormValues, form),
    };
};

export const useDefaultFormValues = (
    { contactInfo, terminalFormValues }: { contactInfo?: InitContextContactInfo; terminalFormValues?: object },
    form: ServiceProviderMetadataForm,
) => useMemo(() => toDefaultFormValues(contactInfo, terminalFormValues, form), [contactInfo, terminalFormValues, form]);
