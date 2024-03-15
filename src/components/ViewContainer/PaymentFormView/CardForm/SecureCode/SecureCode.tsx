import { number } from 'card-validator';
import { FieldError, UseFormRegister } from 'react-hook-form';

import { formatCVC } from './formatCVC';
import { validateSecureCode } from './validateSecureCode';
import { Locale } from '../../../../../common/contexts';
import { isNil, safeVal } from '../../../../../common/utils';
import { Input } from '../../../../legacy';
import { ReactComponent as LockIcon } from '../../../../legacy/icon/lock.svg';
import { CardFormInputs } from '../types';

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
