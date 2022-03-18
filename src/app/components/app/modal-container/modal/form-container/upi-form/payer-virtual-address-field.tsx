import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';

import { isError } from 'checkout/utils';
import { Input } from '../input';
import { Locale } from 'checkout/locale';

const validatePayerVirtualAddress = (value: string): boolean => !value || !value.trim();

const WrappedInput: React.FC<WrappedFieldProps & { locale: Locale }> = ({ locale, input, meta }) => (
    <Input
        {...input}
        {...meta}
        id="payer-virtual-address-input"
        type="string"
        placeholder={locale['form.pay.upi.payerVirtualAddress']}
        mark={true}
        error={isError(meta)}
    />
);

export const PayerVirtualAddressField: React.FC<{ locale: Locale }> = ({ locale }) => (
    <Field
        name="payerVirtualAddress"
        component={WrappedInput}
        props={{ locale }}
        validate={validatePayerVirtualAddress}
    />
);
