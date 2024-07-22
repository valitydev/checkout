import { FormControl, InputGroup, InputLeftElement, Square, Input } from '@chakra-ui/react';
import { useContext } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import { HiCreditCard } from 'react-icons/hi';

import { StatusInputRightElement } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { formatCardNumber } from './formatCardNumber';
import { validateCardNumber } from './validateCardNumber';
import { CardFormInputs } from '../types';

export type CardNumberFormControlProps = {
    register: UseFormRegister<CardFormInputs>;
    formState: FormState<CardFormInputs>;
};

export function CardNumberFormControl({ register, formState: { errors, dirtyFields } }: CardNumberFormControlProps) {
    const { l } = useContext(LocaleContext);

    const inputRightElStatus = isNil(errors.cardNumber) && dirtyFields.cardNumber ? 'success' : 'unknown';

    return (
        <FormControl isInvalid={!isNil(errors.cardNumber)}>
            <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                    <Square as={HiCreditCard} color="gray.400" />
                </InputLeftElement>
                <Input
                    {...register('cardNumber', {
                        required: true,
                        validate: (value) => !validateCardNumber(value) || 'Card number is invalid',
                    })}
                    autoComplete="cc-number"
                    placeholder={l['form.input.card.placeholder']}
                    type="tel"
                    onInput={formatCardNumber}
                />
                <StatusInputRightElement status={inputRightElStatus} />
            </InputGroup>
        </FormControl>
    );
}
