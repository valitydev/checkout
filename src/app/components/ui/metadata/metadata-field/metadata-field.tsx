import * as React from 'react';
import { useMemo } from 'react';
import { Field, Validator, WrappedFieldProps } from 'redux-form';

import { MetadataTextLocalization, ServiceProviderMetadataField } from 'checkout/backend';
import { formatEmail, isError, validateEmail } from 'checkout/utils';
import { Input } from 'checkout/components';

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
            autocomplete={getAutocomplete(type)}
            onInput={getOnInputHandler(type)}
        />
    );
};
