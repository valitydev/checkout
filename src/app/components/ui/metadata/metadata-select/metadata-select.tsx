import * as React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { MetadataTextLocalization, ServiceProviderMetadataSelect } from 'checkout/backend';
import { Select } from 'checkout/components';
import { countries, Country, CountrySubdivision } from 'checkout/utils';
import isNil from 'checkout/utils/is-nil';

export interface MetadataSelectProps {
    metadata: ServiceProviderMetadataSelect;
    localeCode: string;
    wrappedName: string;
    register: UseFormRegister<any>;
    fieldError: FieldError;
    isDirty: boolean;
}

const findCountry = (countryCode: string) => (country: Country) => country.code === countryCode;

const toOptions = ({ name, code }: CountrySubdivision) => ({
    label: name,
    value: code,
});

const getDefOptionLabel = (localeCode: string, localization: MetadataTextLocalization) =>
    localization[localeCode] || localization['en'];

const createValidator = (required: boolean) => (value) => {
    if (!required) {
        return undefined;
    }
    if (required) {
        return isNil(value);
    }
};

export const MetadataSelect = ({
    wrappedName,
    metadata: { name, src, localization, required },
    register,
    localeCode,
    fieldError,
    isDirty,
}: MetadataSelectProps) => {
    const registerName = wrappedName ? `${wrappedName}.${name}` : name;
    const subdivisions = countries.find(findCountry(src.countryCode)).sub;
    const options = subdivisions.map(toOptions);
    const validate = React.useMemo(() => createValidator(required), [name]);
    return (
        <Select
            {...register(registerName, {
                required,
                validate: (value) => !validate(value) || `${name} field is invalid`,
            })}
            error={!isNil(fieldError)}
            dirty={isDirty}
        >
            <option value="">{getDefOptionLabel(localeCode, localization)}</option>
            {options.map(({ value, label }, i) => (
                <option key={i} value={value}>
                    {value} - {label}
                </option>
            ))}
        </Select>
    );
};
