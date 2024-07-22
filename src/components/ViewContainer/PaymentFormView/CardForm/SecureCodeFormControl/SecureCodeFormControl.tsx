import { FormControl, Input, InputGroup, InputLeftElement, Square } from '@chakra-ui/react';
import { number } from 'card-validator';
import { useContext } from 'react';
import { FormState, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { HiLockClosed } from 'react-icons/hi';

import { StatusInputRightElement } from 'checkout/components';
import { Locale, LocaleContext } from 'checkout/contexts';
import { isNil, safeVal } from 'checkout/utils';

import { formatCVC } from './formatCVC';
import { validateSecureCode } from './validateSecureCode';
import { CardFormInputs } from '../types';

export type SecureCodeFormControlProps = {
    register: UseFormRegister<CardFormInputs>;
    formState: FormState<CardFormInputs>;
    watch: UseFormWatch<CardFormInputs>;
    obscureCardCvv: boolean;
};

export function SecureCodeFormControl({
    register,
    formState: { errors, dirtyFields },
    obscureCardCvv,
    watch,
}: SecureCodeFormControlProps) {
    const { l } = useContext(LocaleContext);

    const inputRightElStatus = isNil(errors.secureCode) && dirtyFields.secureCode ? 'success' : 'unknown';

    const cardNumber = watch('cardNumber');

    const getPlaceholder = (cardNumber: string | null, locale: Locale) => {
        const name = number(cardNumber)?.card?.code.name;
        return name || locale['form.input.secure.placeholder'];
    };

    return (
        <FormControl isInvalid={!isNil(errors.secureCode)}>
            <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                    <Square as={HiLockClosed} color="gray.400" />
                </InputLeftElement>
                <Input
                    {...register('secureCode', {
                        required: true,
                        validate: (value) => !validateSecureCode(value, { cardNumber }) || 'Secure code is invalid',
                    })}
                    autoComplete="cc-csc"
                    placeholder={getPlaceholder(cardNumber, l)}
                    type={obscureCardCvv ? 'password' : 'tel'}
                    onInput={(e) => {
                        const target = e.currentTarget;
                        const value = target.value;
                        const formatted = formatCVC(value, cardNumber);
                        return safeVal(formatted, target);
                    }}
                />
                <StatusInputRightElement status={inputRightElStatus} />
            </InputGroup>
        </FormControl>
    );
}
