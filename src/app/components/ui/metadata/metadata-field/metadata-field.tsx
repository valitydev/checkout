import * as React from 'react';
import { useMemo } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import isNil from 'checkout/utils/is-nil';
import partialRight from 'checkout/utils/partial-right';

import { MetadataFieldFormatter, MetadataTextLocalization, ServiceProviderMetadataField } from 'checkout/backend';
import { formatPhoneNumber, formatOnFocus, validateEmail, validatePhone } from 'checkout/utils';
import { Input } from 'checkout/components';
import { getInputTypeFormatter, getMetadataFieldFormatter } from './formatters';

const getAutocomplete = (type: JSX.IntrinsicElements['input']['type']): string | null => {
    switch (type) {
        case 'email':
            return 'email';
        case 'tel':
            return 'tel';
        default:
            return null;
    }
};

const getOnInputHandler = (type: JSX.IntrinsicElements['input']['type'], formatter?: MetadataFieldFormatter) => {
    if (!isNil(formatter)) {
        return getMetadataFieldFormatter(formatter);
    }
    return getInputTypeFormatter(type);
};

const getOnFocusHandler = (type: JSX.IntrinsicElements['input']['type']) => {
    switch (type) {
        case 'tel':
            return partialRight(formatPhoneNumber, formatOnFocus);
        default:
            return null;
    }
};

const getPlaceholder = (localeCode: string, localization: MetadataTextLocalization) => {
    if (isNil(localization)) {
        console.error('Metadata localization is not defined');
        return '';
    }
    return localization[localeCode] || localization['en'];
};

const createValidator =
    (type: JSX.IntrinsicElements['input']['type'], required: boolean, pattern?: string) => (value) => {
        if (!required && isNil(value)) {
            return undefined;
        }
        if (type === 'email') {
            return validateEmail(value);
        }
        if (type === 'tel') {
            return validatePhone(value);
        }
        if (pattern) {
            return !new RegExp(pattern).test(value);
        }
        if (required) {
            return !value || !value.trim();
        }
    };

export interface MetadataFieldProps {
    metadata: ServiceProviderMetadataField;
    localeCode?: string;
    wrappedName?: string;
    register: UseFormRegister<any>;
    fieldError: FieldError;
    isDirty: boolean;
}

export const MetadataField = ({
    metadata: { name, type, required, pattern, localization, formatter, inputMode },
    localeCode,
    wrappedName,
    register,
    fieldError,
    isDirty,
}: MetadataFieldProps) => {
    const validate = useMemo(() => createValidator(type, required, pattern), [name]);
    const registerName = wrappedName ? `${wrappedName}.${name}` : name;
    return (
        <Input
            {...register(registerName, {
                required: true,
                validate: (value) => !validate(value) || `${name} field is invalid`,
            })}
            type={type}
            placeholder={getPlaceholder(localeCode, localization)}
            mark={true}
            onInput={getOnInputHandler(type, formatter)}
            onFocus={getOnFocusHandler(type)}
            autoComplete={getAutocomplete(type)}
            inputMode={inputMode}
            error={!isNil(fieldError)}
            dirty={isDirty}
        />
    );
};
