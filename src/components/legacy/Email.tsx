import { FieldError, FieldErrorsImpl, Merge, UseFormRegister } from 'react-hook-form';

import { Input } from './Input';
import { Locale } from '../../common/contexts';
import { isNil, formatEmail, validateEmail } from '../../common/utils';

export type EmailProps = {
    registerName: string;
    register: UseFormRegister<any>;
    locale: Locale;
    fieldError: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    isDirty: boolean;
};

export const Email = ({ registerName, register, locale, fieldError, isDirty }: EmailProps) => (
    <Input
        {...register(registerName, {
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
