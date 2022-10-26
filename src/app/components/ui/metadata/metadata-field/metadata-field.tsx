import * as React from 'react';
import { useMemo } from 'react';
import { Field, Validator, WrappedFieldProps } from 'redux-form';
import isNil from 'lodash-es/isNil';
import partialRight from 'lodash-es/partialRight';

import {
    AttributeInputMode,
    AttributeType,
    MetadataFieldFormatter,
    MetadataTextLocalization,
    ServiceProviderMetadataField
} from 'checkout/backend';
import { formatPhoneNumber, isError, formatOnFocus, validateEmail, validatePhone } from 'checkout/utils';
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

const getPlaceholder = (localeCode: string, localization: MetadataTextLocalization) =>
    localization[localeCode] || localization['en'];

const WrappedInput: React.FC<WrappedFieldProps & {
    type: AttributeType;
    name: string;
    localization: MetadataTextLocalization;
    localeCode: string;
    required: boolean;
    formatter: MetadataFieldFormatter;
    inputMode: AttributeInputMode;
}> = ({ type, name, input, meta, localeCode, localization, formatter, inputMode }) => (
    <Input
        {...input}
        {...meta}
        name={name}
        type={type}
        placeholder={getPlaceholder(localeCode, localization)}
        mark={true}
        error={isError(meta)}
        onInput={getOnInputHandler(type, formatter)}
        onFocus={getOnFocusHandler(type)}
        autocomplete={getAutocomplete(type)}
        inputMode={inputMode}
    />
);

const createValidator = (
    type: JSX.IntrinsicElements['input']['type'],
    required: boolean,
    pattern?: string
): Validator => (value) => {
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
}

export const MetadataField: React.FC<MetadataFieldProps> = ({
    metadata: { name, type, required, pattern, localization, formatter, inputMode },
    localeCode,
    wrappedName
}) => {
    const validate = useMemo(() => createValidator(type, required, pattern), [name]);
    return (
        <Field
            name={wrappedName ? `${wrappedName}.${name}` : name}
            component={WrappedInput}
            props={{ type, name, localization, localeCode, required, formatter, inputMode }}
            validate={validate}
        />
    );
};
