import { FormControl, InputGroup, InputLeftElement, Square, Input } from '@chakra-ui/react';
import { useContext } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import { HiUser } from 'react-icons/hi';

import { StatusInputRightElement } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { CardFormInputs } from '../types';
import { validateStringValue } from '../utils';

export type LastNameFormControlProps = {
    register: UseFormRegister<CardFormInputs>;
    formState: FormState<CardFormInputs>;
};

export function LastNameFormControl({ register, formState: { errors, dirtyFields } }: LastNameFormControlProps) {
    const { l } = useContext(LocaleContext);

    const inputRightElStatus =
        isNil(errors?.contactInfo?.lastName) && dirtyFields?.contactInfo?.lastName ? 'success' : 'unknown';

    return (
        <FormControl isInvalid={!isNil(errors?.contactInfo?.lastName)}>
            <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                    <Square as={HiUser} color="gray.400" />
                </InputLeftElement>
                <Input
                    {...register('contactInfo.lastName', {
                        required: true,
                        validate: validateStringValue(),
                    })}
                    autoComplete="off"
                    placeholder={l['form.input.lastName.placeholder']}
                />
                <StatusInputRightElement status={inputRightElStatus} />
            </InputGroup>
        </FormControl>
    );
}
