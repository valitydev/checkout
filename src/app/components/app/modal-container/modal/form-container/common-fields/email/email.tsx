import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';

import { formatEmail, isError, validateEmail } from 'checkout/utils';
import { Locale } from 'checkout/locale';
import { Input } from 'checkout/components';

export interface EmailDefProps {
    locale: Locale;
}

const WrappedInput = ({ input, meta, locale }: WrappedFieldProps & EmailDefProps) => (
    <Input
        {...input}
        {...meta}
        error={isError(meta)}
        placeholder={locale['form.input.email.placeholder']}
        mark={true}
        type="email"
        id="email-input"
        onInput={formatEmail}
        autocomplete="email"
    />
);

export const Email = ({ locale }: EmailDefProps) => (
    <Field name="email" component={WrappedInput} props={{ locale }} validate={validateEmail} />
);
