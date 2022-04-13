import * as React from 'react';
import { useMemo } from 'react';
import { Field, Validator, WrappedFieldProps } from 'redux-form';

import { Locale } from 'checkout/locale';
import { MetadataFieldLocalization, ServiceProviderMetadataField } from 'checkout/backend';
import { formatEmail, isError, validateEmail } from 'checkout/utils';
import { Input } from 'checkout/components';

const getPlaceholder = (
    fieldName: string,
    locale: Locale,
    localeCode: string,
    localization?: MetadataFieldLocalization
) => {
    if (localization) {
        return localization[localeCode] || localization['en'];
    }
    return locale['service.provider.meta.fields'][fieldName];
};

const WrappedInput: React.FC<WrappedFieldProps & {
    locale: Locale;
    type: string;
    name: string;
    localization: MetadataFieldLocalization;
    localeCode: string;
}> = ({ locale, type, name, input, meta, localeCode, localization }) => (
    <Input
        {...input}
        {...meta}
        name={name}
        type={type}
        placeholder={getPlaceholder(name, locale, localeCode, localization)}
        mark={true}
        error={isError(meta)}
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
    if (pattern) {
        return !new RegExp(pattern).test(value);
    }
    if (required) {
        return !value || !value.trim();
    }
};

const getAutocomplete = (type: JSX.IntrinsicElements['input']['type']): string | null => {
    switch (type) {
        case 'email':
            return 'email';
        default:
            return null;
    }
};

const getOnInputHandler = (type: JSX.IntrinsicElements['input']['type']) => {
    switch (type) {
        case 'email':
            return formatEmail;
        default:
            return null;
    }
};

export interface MetadataFieldProps {
    locale: Locale;
    metadata: ServiceProviderMetadataField;
    localeCode?: string;
    wrappedName?: string;
}

export const MetadataField: React.FC<MetadataFieldProps> = ({
    locale,
    metadata: { name, type, required, pattern, localization },
    localeCode,
    wrappedName
}) => {
    const validate = useMemo(() => createValidator(type, required, pattern), [name]);
    return (
        <Field
            name={wrappedName ? `${wrappedName}.${name}` : name}
            component={WrappedInput}
            props={{ locale, type, name, localization, localeCode }}
            validate={validate}
            autocomplete={getAutocomplete(type)}
            onInput={getOnInputHandler(type)}
        />
    );
};
