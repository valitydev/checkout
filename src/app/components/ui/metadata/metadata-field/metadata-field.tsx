import * as React from 'react';
import { useMemo } from 'react';
import { Field, Validator, WrappedFieldProps } from 'redux-form';

import { MetadataTextLocalization, ServiceProviderMetadataField } from 'checkout/backend';
import { formatEmail, formatPhoneNumber, isError, validateEmail, validatePhone } from 'checkout/utils';
import { Input } from 'checkout/components';

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

const getOnInputHandler = (type: JSX.IntrinsicElements['input']['type']) => {
    switch (type) {
        case 'email':
            return formatEmail;
        case 'tel':
            return formatPhoneNumber;
        default:
            return null;
    }
};

const getOnFocusHandler = (type: JSX.IntrinsicElements['input']['type']) => {
    switch (type) {
        case 'tel':
            return formatPhoneNumber;
        default:
            return null;
    }
};

const getPlaceholder = (localeCode: string, localization: MetadataTextLocalization) =>
    localization[localeCode] || localization['en'];

const WrappedInput: React.FC<WrappedFieldProps & {
    type: string;
    name: string;
    localization: MetadataTextLocalization;
    localeCode: string;
}> = ({ type, name, input, meta, localeCode, localization }) => (
    <Input
        {...input}
        {...meta}
        name={name}
        type={type}
        placeholder={getPlaceholder(localeCode, localization)}
        mark={true}
        error={isError(meta)}
        onInput={getOnInputHandler(type)}
        onFocus={getOnFocusHandler(type)}
        autocomplete={getAutocomplete(type)}
    />
);

const createValidator = (
    type: JSX.IntrinsicElements['input']['type'],
    required: boolean,
    pattern?: string
): Validator => (value) => {
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
}

export const MetadataField: React.FC<MetadataFieldProps> = ({
    metadata: { name, type, required, pattern, localization },
    localeCode,
    wrappedName
}) => {
    const validate = useMemo(() => createValidator(type, required, pattern), [name]);
    return (
        <Field
            name={wrappedName ? `${wrappedName}.${name}` : name}
            component={WrappedInput}
            props={{ type, name, localization, localeCode }}
            validate={validate}
        />
    );
};
