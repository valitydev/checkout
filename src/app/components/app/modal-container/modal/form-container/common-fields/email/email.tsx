import * as React from 'react';
import { FieldError, FieldErrorsImpl, Merge, UseFormRegister } from 'react-hook-form';

import { Input } from 'checkout/components';
import { Locale } from 'checkout/locale';
import { formatEmail, validateEmail } from 'checkout/utils';
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
        autoComplete="email"
        dirty={isDirty}
        error={!isNil(fieldError)}
        id="email-input"
        mark={true}
        placeholder={locale['form.input.email.placeholder']}
        type="email"
        onInput={formatEmail}
    />
);
