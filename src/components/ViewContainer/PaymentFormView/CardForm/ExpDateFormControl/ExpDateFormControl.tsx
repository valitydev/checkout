import { FormControl, Input, InputGroup, InputLeftElement, Square } from '@chakra-ui/react';
import { useContext } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import { HiCalendar } from 'react-icons/hi';

import { StatusInputRightElement } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { formatExpiry } from './formatExpiry';
import { validateExpireDate } from './validateExpireDate';
import { CardFormInputs } from '../types';

export type ExpDateFormControlProps = {
    register: UseFormRegister<CardFormInputs>;
    formState: FormState<CardFormInputs>;
};

export function ExpDateFormControl({ register, formState: { errors, dirtyFields } }: ExpDateFormControlProps) {
    const { l } = useContext(LocaleContext);

    const inputRightElStatus = isNil(errors.expireDate) && dirtyFields.expireDate ? 'success' : 'unknown';

    return (
        <FormControl isInvalid={!isNil(errors.expireDate)}>
            <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                    <Square as={HiCalendar} color="gray.400" />
                </InputLeftElement>
                <Input
                    {...register('expireDate', {
                        required: true,
                        validate: (value) => !validateExpireDate(value) || 'Exp date is invalid',
                    })}
                    autoComplete="cc-exp"
                    placeholder={l['form.input.expiry.placeholder']}
                    type="tel"
                    onInput={formatExpiry}
                />
                <StatusInputRightElement status={inputRightElStatus} />
            </InputGroup>
        </FormControl>
    );
}
