import * as React from 'react';
import { FieldError, FieldErrorsImpl, Merge, UseFormRegister } from 'react-hook-form';
import { formatEmail, validateEmail } from 'checkout/utils';
import { Locale } from 'checkout/locale';
import { Input } from 'checkout/components';
import isNil from 'checkout/utils/is-nil';

export type EmailProps = {
    register: UseFormRegister<any>;
    locale: Locale;
    fieldError: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    isDirty: boolean;
};

export const Email = ({ register, locale, fieldError, isDirty }: EmailProps) => (
    <Input
        {...register('email', {
            required: true,
            validate: (value) => !validateEmail(value) || 'Email is invalid',
        })}
        placeholder={locale['form.input.email.placeholder']}
        mark={true}
        type="email"
        id="email-input"
        onInput={formatEmail}
        autoComplete="email"
        error={!isNil(fieldError)}
        dirty={isDirty}
    />
);
