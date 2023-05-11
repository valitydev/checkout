import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';

import { Locale } from 'checkout/locale';
import { validatePhone } from './validate-phone';
import { Input } from 'checkout/components';
import { formatPhoneNumber, isError } from 'checkout/utils';

export interface PhoneProps {
    locale: Locale;
}

const WrappedInput = ({ input, meta, locale }: WrappedFieldProps & PhoneProps) => (
    <Input
        {...input}
        {...meta}
        error={isError(meta)}
        placeholder={locale['form.input.phone.placeholder']}
        mark={true}
        type="tel"
        id="phone-input"
        onInput={formatPhoneNumber}
        onFocus={formatPhoneNumber}
        autocomplete="tel"
    />
);

export const Phone = ({ locale }: PhoneProps) => (
    <Field name="phoneNumber" component={WrappedInput} props={{ locale }} validate={validatePhone} />
);
