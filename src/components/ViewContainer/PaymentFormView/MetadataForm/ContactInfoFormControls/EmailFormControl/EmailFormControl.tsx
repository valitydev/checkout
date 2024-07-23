import { FormControl, Input, InputGroup } from '@chakra-ui/react';
import { useContext } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';

import { StatusInputRightElement } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';
import { formatEmail, isNil, validateEmail } from 'checkout/utils';

import { MetadataFormValues } from '../../types';

export type EmailFormControlProps = {
    register: UseFormRegister<MetadataFormValues>;
    formState: FormState<MetadataFormValues>;
};

export function EmailFormControl({ register, formState: { errors, dirtyFields } }: EmailFormControlProps) {
    const { l } = useContext(LocaleContext);

    const inputRightElStatus =
        isNil(errors?.contactInfo?.email) && dirtyFields?.contactInfo?.email ? 'success' : 'unknown';

    return (
        <FormControl isInvalid={!isNil(errors?.contactInfo?.email)}>
            <InputGroup size="lg">
                <Input
                    {...register('contactInfo.email', {
                        required: true,
                        validate: (value) => !validateEmail(value) || 'Email is invalid',
                    })}
                    autoComplete="email"
                    placeholder={l['form.input.email.placeholder']}
                    type="email"
                    onInput={formatEmail}
                />
                <StatusInputRightElement status={inputRightElStatus} />
            </InputGroup>
        </FormControl>
    );
}
