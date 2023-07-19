import * as React from 'react';
import { FieldError, FieldErrorsImpl, Merge, UseFormRegister } from 'react-hook-form';

import { Locale } from 'checkout/locale';
import { Input } from 'checkout/components';
import { formatPhoneNumber, validatePhone } from 'checkout/utils';
import isNil from 'checkout/utils/is-nil';

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
            validate: (value) => !validatePhone(value) || 'Phone number is invalid'
        })}
        placeholder={locale['form.input.phone.placeholder']}
        mark={true}
        type="tel"
        id="phone-input"
        onInput={formatPhoneNumber}
        onFocus={formatPhoneNumber}
        autoComplete="tel"
        error={!isNil(fieldError)}
        dirty={isDirty}
    />
);
