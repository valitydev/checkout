import { number } from 'card-validator';
import * as React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

import { Input } from 'checkout/components';
import { Locale } from 'checkout/locale';
import { safeVal } from 'checkout/utils';
import isNil from 'checkout/utils/is-nil';

import { formatCVC } from './format-cvc';
import { validateSecureCode } from './validate-secure-code';
import { ReactComponent as LockIcon } from '../../../../../../../ui/icon/lock.svg';
import { CardFormInputs } from '../../card-form-inputs';

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
            validate: (value) => !validateSecureCode(value, { cardNumber }) || 'Secure code is invalid',
        })}
        autoComplete="cc-csc"
        dirty={isDirty}
        error={!isNil(fieldError)}
        icon={<LockIcon />}
        id="secure-code-input"
        mark={true}
        placeholder={getPlaceholder(cardNumber, locale)}
        type={obscureCardCvv ? 'password' : 'tel'}
        onInput={(e) => {
            const target = e.currentTarget;
            const value = target.value;
            const formatted = formatCVC(value, cardNumber);
            return safeVal(formatted, target);
        }}
    />
);
