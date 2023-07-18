import * as React from 'react';
import { number } from 'card-validator';
import { FieldError, UseFormRegister } from 'react-hook-form';

import { validateSecureCode } from './validate-secure-code';
import { Locale } from 'checkout/locale';
import { formatCVC } from './format-cvc';
import { Lock, Input } from 'checkout/components';
import { safeVal } from 'checkout/utils';
import { CardFormInputs } from '../../card-form-inputs';
import isNil from 'checkout/utils/is-nil';

export interface SecureCodeProps {
    register: UseFormRegister<CardFormInputs>;
    locale: Locale;
    obscureCardCvv: boolean;
    cardNumber: string;
    fieldError: FieldError;
    isDirty: boolean;
}

const getPlaceholder = (cardNumber: string | null, locale: Locale) => {
    const name = number(cardNumber)?.card?.code.name;
    return name || locale['form.input.secure.placeholder'];
};

export const SecureCode = ({ cardNumber, locale, obscureCardCvv, register, fieldError, isDirty }: SecureCodeProps) => (
    <Input
        {...register('secureCode', {
            required: true,
            validate: (value) => !validateSecureCode(value, { cardNumber }) || 'Secure code is invalid'
        })}
        icon={<Lock />}
        placeholder={getPlaceholder(cardNumber, locale)}
        mark={true}
        type={obscureCardCvv ? 'password' : 'tel'}
        id="secure-code-input"
        autoComplete="cc-csc"
        error={!isNil(fieldError)}
        dirty={isDirty}
        onInput={(e) => {
            const target = e.currentTarget;
            let value = target.value;
            const formatted = formatCVC(value, cardNumber);
            return safeVal(formatted, target);
        }}
    />
);
