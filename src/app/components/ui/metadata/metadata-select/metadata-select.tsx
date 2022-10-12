import * as React from 'react';
import { Field, Validator, WrappedFieldProps } from 'redux-form';
import isNil from 'lodash-es/isNil';

import { MetadataTextLocalization, ServiceProviderMetadataSelect } from 'checkout/backend';
import { isError } from 'checkout/utils';
import { Select } from 'checkout/components';

export interface SelectorOption {
    label: string;
    value: string;
}

const getDefOptionLabel = (localeCode: string, localization: MetadataTextLocalization) =>
    localization[localeCode] || localization['en'];

const WrappedSelect = ({
    input,
    meta,
    localization,
    localeCode,
    options
}: WrappedFieldProps & {
    name: string;
    localization: MetadataTextLocalization;
    localeCode: string;
    options: SelectorOption[];
}) => {
    return (
        <Select onChange={input.onChange} isError={isError(meta)} isActive={meta.active} isPristine={meta.pristine}>
            <option value="">{getDefOptionLabel(localeCode, localization)}</option>
            {options.map(({ value, label }, i) => (
                <option key={i} value={value}>
                    {value} - {label}
                </option>
            ))}
        </Select>
    );
};

const createValidator = (required: boolean): Validator => (value) => {
    if (!required) {
        return undefined;
    }
    if (required) {
        return isNil(value);
    }
};

export interface MetadataSelectProps {
    metadata: ServiceProviderMetadataSelect;
    options: SelectorOption[];
    localeCode?: string;
    wrappedName?: string;
}

export const MetadataSelect = ({
    metadata: { name, required, localization },
    wrappedName,
    localeCode,
    options
}: MetadataSelectProps) => {
    const validate = React.useMemo(() => createValidator(required), [name]);
    return (
        <Field
            name={wrappedName ? `${wrappedName}.${name}` : name}
            component={WrappedSelect}
            props={{ name, localization, required, localeCode }}
            validate={validate}
            options={options}
        />
    );
};
