import * as React from 'react';
import { useMemo } from 'react';
import { Field, Validator, WrappedFieldProps } from 'redux-form';

import { Locale } from 'checkout/locale';
import { MetadataFieldLocalization, ServiceProviderMetadataField } from 'checkout/backend';
import { isError } from 'checkout/utils';
import { Input } from 'checkout/components';

const getPlaceholder = (
    fieldName: string,
    locale: Locale,
    localeCode: string,
    localization?: MetadataFieldLocalization
) => {
    if (localization) {
        const metaLocalization = localization[localeCode];
        return metaLocalization || fieldName;
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

const createValidator = (required: boolean, pattern?: string): Validator => (value) => {
    if (pattern) {
        return !new RegExp(pattern).test(value);
    }
    if (required) {
        return !value || !value.trim();
    }
};

export interface MetadataFieldProps {
    locale: Locale;
    metadata: ServiceProviderMetadataField;
    localeCode?: string;
}

export const MetadataField: React.FC<MetadataFieldProps> = ({
    locale,
    metadata: { name, type, required, pattern, localization },
    localeCode
}) => {
    const validate = useMemo(() => createValidator(required, pattern), [name]);
    return (
        <Field
            name={`metadata.${name}`}
            component={WrappedInput}
            props={{ locale, type, name, localization, localeCode }}
            validate={validate}
        />
    );
};
