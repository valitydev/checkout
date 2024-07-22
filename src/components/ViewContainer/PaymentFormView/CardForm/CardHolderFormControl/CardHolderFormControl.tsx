import { FormControl, InputGroup, InputLeftElement, Square, Input } from '@chakra-ui/react';
import { useContext } from 'react';
import { UseFormRegister, FormState } from 'react-hook-form';
import { HiUser } from 'react-icons/hi';

import { StatusInputRightElement } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { formatCardHolder } from './formatCardHolder';
import { validateCardHolder } from './validateCardHolder';
import { CardFormInputs } from '../types';

export type CardHolderFormControlProps = {
    register: UseFormRegister<CardFormInputs>;
    formState: FormState<CardFormInputs>;
};

export function CardHolderFormControl({ register, formState: { errors, dirtyFields } }: CardHolderFormControlProps) {
    const { l } = useContext(LocaleContext);

    const inputRightElStatus = isNil(errors.cardHolder) && dirtyFields.cardHolder ? 'success' : 'unknown';

    return (
        <FormControl isInvalid={!isNil(errors.cardHolder)}>
            <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                    <Square as={HiUser} color="gray.400" />
                </InputLeftElement>
                <Input
                    {...register('cardHolder', {
                        required: true,
                        validate: (value) => !validateCardHolder(value) || 'Card holder is invalid',
                    })}
                    autoComplete="cc-name"
                    placeholder={l['form.input.cardholder.placeholder']}
                    onInput={formatCardHolder}
                />
                <StatusInputRightElement status={inputRightElStatus} />
            </InputGroup>
        </FormControl>
    );
}
