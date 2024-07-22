import { Input, FormControl, InputGroup } from '@chakra-ui/react';
import { useContext } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';

import { StatusInputRightElement } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';
import { formatPhoneNumber, isNil, validatePhone } from 'checkout/utils';

import { MetadataFormValues } from '../../types';

export type PhoneNumberFormControlProps = {
    register: UseFormRegister<MetadataFormValues>;
    formState: FormState<MetadataFormValues>;
};

export function PhoneNumberFormControl({ register, formState: { errors, dirtyFields } }: PhoneNumberFormControlProps) {
    const { l } = useContext(LocaleContext);

    const inputRightElStatus =
        isNil(errors?.contactInfo?.phoneNumber) && dirtyFields?.contactInfo?.phoneNumber ? 'success' : 'unknown';

    return (
        <FormControl isInvalid={!isNil(errors?.contactInfo?.email)}>
            <InputGroup size="lg">
                <Input
                    {...register('contactInfo.phoneNumber', {
                        required: true,
                        validate: (value) => !validatePhone(value) || 'Phone number is invalid',
                    })}
                    autoComplete="tel"
                    placeholder={l['form.input.phone.placeholder']}
                    type="tel"
                    onFocus={formatPhoneNumber}
                    onInput={formatPhoneNumber}
                />
                <StatusInputRightElement status={inputRightElStatus} />
            </InputGroup>
        </FormControl>
    );
}
