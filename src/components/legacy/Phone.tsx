import { FieldError, FieldErrorsImpl, Merge, UseFormRegister } from 'react-hook-form';

import { Locale } from 'checkout/locale';

import { Input } from './Input';
import { isNil, formatPhoneNumber, validatePhone } from '../../common/utils';

export interface PhoneProps {
    register: UseFormRegister<any>;
    locale: Locale;
    fieldError: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    isDirty: boolean;
}

export const Phone = ({ register, locale, fieldError, isDirty }: PhoneProps) => (
    <Input
        {...register('phoneNumber', {
            required: true,
            validate: (value) => !validatePhone(value) || 'Phone number is invalid',
        })}
        autoComplete="tel"
        dirty={isDirty}
        error={!isNil(fieldError)}
        id="phone-input"
        mark={true}
        placeholder={locale['form.input.phone.placeholder']}
        type="tel"
        onFocus={formatPhoneNumber}
        onInput={formatPhoneNumber}
    />
);
