import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';

import { validateExpireDate } from './validate-expire-date';
import { Locale } from 'checkout/locale';
import { formatExpiry } from './format-expiry';
import { Calendar, Input } from 'checkout/components';
import { isError } from 'checkout/utils';

export interface ExpireDateProps {
    locale: Locale;
}

const WrappedInput = ({ input, meta, locale }: WrappedFieldProps & ExpireDateProps) => (
    <Input
        {...input}
        {...meta}
        error={isError(meta)}
        icon={<Calendar />}
        placeholder={locale['form.input.expiry.placeholder']}
        mark={true}
        type="tel"
        id="expire-date-input"
        onInput={formatExpiry}
        autocomplete="cc-exp"
    />
);

export const ExpireDate = ({ locale }: ExpireDateProps) => (
    <Field name="expireDate" component={WrappedInput} props={{ locale }} validate={validateExpireDate} />
);
