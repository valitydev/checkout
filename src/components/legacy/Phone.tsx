import { FieldError, FieldErrorsImpl, Merge, UseFormRegister } from 'react-hook-form';

import { Locale } from 'checkout/locale';

import { Input } from './Input';
import { isNil, formatPhoneNumber, validatePhone } from '../../common/utils';

export interface PhoneProps {
    registerName: string;
    register: UseFormRegister<any>;
    locale: Locale;
    fieldError: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    isDirty: boolean;
}

export const Phone = ({ registerName, register, locale, fieldError, isDirty, onChange }: PhoneProps) => (
    <Input
        {...register(registerName, {
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
