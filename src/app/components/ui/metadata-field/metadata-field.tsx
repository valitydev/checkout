import * as React from 'react';
import { useMemo } from 'react';
import { Field, Validator, WrappedFieldProps } from 'redux-form';

import { Locale } from 'checkout/locale';
import { ServiceProviderMetadataField } from 'checkout/backend';
import { isError } from 'checkout/utils';
import { Input } from 'checkout/components';

const WrappedInput: React.FC<WrappedFieldProps & {
    locale: Locale;
    type: string;
    name: string;
}> = ({ locale, type, name, input, meta }) => (
    <Input
        {...input}
        {...meta}
        name={name}
        type={type}
        placeholder={locale['service.provider.meta.fields'][name]}
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

export const MetadataField: React.FC<{ locale: Locale; metadata: ServiceProviderMetadataField }> = ({
    locale,
    metadata: { name, type, required, pattern }
}) => {
    const validate = useMemo(() => createValidator(required, pattern), [name]);
    return (
        <Field name={`metadata.${name}`} component={WrappedInput} props={{ locale, type, name }} validate={validate} />
    );
};
