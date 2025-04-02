import { FormControl, InputGroup, Select } from '@chakra-ui/react';
import { useContext } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';

import { MetadataTextLocalization, ServiceProviderMetadataSelect } from 'checkout/backend/payments';
import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { MetadataFormValues } from '../types';

const getPlaceholder = (localeCode: string, localization: MetadataTextLocalization) => {
    if (isNil(localization)) {
        console.error('Metadata localization is not defined');
        return '';
    }
    return localization[localeCode] || localization['en'];
};

export type MetadataSelectControlProps = {
    metadata: ServiceProviderMetadataSelect;
    register: UseFormRegister<MetadataFormValues>;
    formState: FormState<MetadataFormValues>;
};

const countryCodes = [
    { value: 'AT', label: 'Austria' },
    { value: 'BE', label: 'Belgium' },
    { value: 'BG', label: 'Bulgaria' },
    { value: 'CH', label: 'Switzerland' },
    { value: 'CY', label: 'Cyprus' },
    { value: 'DE', label: 'Germany' },
    { value: 'DK', label: 'Denmark' },
    { value: 'ES', label: 'Spain' },
    { value: 'EE', label: 'Estonia' },
    { value: 'FI', label: 'Finland' },
    { value: 'FR', label: 'France' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'HR', label: 'Croatia' },
    { value: 'IE', label: 'Ireland' },
    { value: 'IT', label: 'Italy' },
    { value: 'LT', label: 'Lithuania' },
    { value: 'LU', label: 'Luxembourg' },
    { value: 'LV', label: 'Latvia' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'NZ', label: 'New Zealand' },
    { value: 'PL', label: 'Poland' },
    { value: 'PT', label: 'Portugal' },
    { value: 'RO', label: 'Romania' },
    { value: 'SK', label: 'Slovakia' },
    { value: 'SI', label: 'Slovenia' },
    { value: 'SE', label: 'Sweden' },
];

export function MetadataSelectControl({ metadata, register, formState: { errors } }: MetadataSelectControlProps) {
    const { name, localization } = metadata;

    const { localeCode } = useContext(LocaleContext);

    return (
        <FormControl isInvalid={!isNil(errors?.metadata?.[name])}>
            <InputGroup size="lg">
                <Select
                    placeholder={getPlaceholder(localeCode, localization)}
                    {...register(`metadata.${name}`, {
                        required: true,
                        validate: () => true || `${name} field is invalid`,
                    })}
                >
                    {countryCodes.map((country, index) => (
                        <option key={index} value={country.value}>
                            {country.label}
                        </option>
                    ))}
                </Select>
            </InputGroup>
        </FormControl>
    );
}
