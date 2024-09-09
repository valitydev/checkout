import { FormControl, InputGroup, Input } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';

import {
    MetadataFieldFormatter,
    MetadataTextLocalization,
    ServiceProviderMetadataField,
} from 'checkout/backend/payments';
import { StatusInputRightElement } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';
import {
    createRegExpForMetaPattern,
    formatOnFocus,
    formatPhoneNumber,
    isNil,
    partialRight,
    validateEmail,
    validatePhone,
} from 'checkout/utils';

import { getInputTypeFormatter, getMetadataFieldFormatter } from './formatters';
import { MetadataFormValues } from '../types';

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
    (type: JSX.IntrinsicElements['input']['type'], required: boolean, pattern?: string) => (value: string) => {
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
            return !createRegExpForMetaPattern(pattern).test(value);
        }
        if (required) {
            return !value || !value.trim();
        }
    };

export type MetadataFieldProps = {
    metadata: ServiceProviderMetadataField;
    register: UseFormRegister<MetadataFormValues>;
    formState: FormState<MetadataFormValues>;
};

export function MetadataFormControl({ metadata, register, formState: { errors, dirtyFields } }: MetadataFieldProps) {
    const { name, type, required, pattern, localization, formatter, inputMode } = metadata;
    const { localeCode } = useContext(LocaleContext);
    const validate = useMemo(() => createValidator(type, required, pattern), [name]);
    const inputRightElStatus = isNil(errors?.metadata?.[name]) && dirtyFields?.metadata?.[name] ? 'success' : 'unknown';

    return (
        <FormControl isInvalid={!isNil(errors?.metadata?.[name])}>
            <InputGroup size="lg">
                <Input
                    {...register(`metadata.${name}`, {
                        required: true,
                        validate: (value) => !validate(value) || `${name} field is invalid`,
                    })}
                    autoComplete={getAutocomplete(type)}
                    inputMode={inputMode}
                    placeholder={getPlaceholder(localeCode, localization)}
                    type={type}
                    onFocus={getOnFocusHandler(type)}
                    onInput={getOnInputHandler(type, formatter)}
                />
                <StatusInputRightElement status={inputRightElStatus} />
            </InputGroup>
        </FormControl>
    );
}
