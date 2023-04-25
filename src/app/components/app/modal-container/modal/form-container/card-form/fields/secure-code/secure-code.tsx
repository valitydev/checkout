import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import { number } from 'card-validator';

import { validateSecureCode } from './validate-secure-code';
import { Locale } from 'checkout/locale';
import { formatCVC } from './format-cvc';
import { Lock, Input } from 'checkout/components';
import { isError } from 'checkout/utils';

export interface SecureCodeProps {
    locale: Locale;
    obscureCardCvv: boolean;
    cardNumber: string;
}

const getPlaceholder = (cardNumber: string | null, locale: Locale) => {
    const name = number(cardNumber)?.card?.code.name;
    return name || locale['form.input.secure.placeholder'];
};

const WrappedInput = ({ input, meta, locale, obscureCardCvv, cardNumber }: WrappedFieldProps & SecureCodeProps) => (
    <Input
        {...input}
        {...meta}
        error={isError(meta)}
        icon={<Lock />}
        placeholder={getPlaceholder(cardNumber, locale)}
        mark={true}
        type={obscureCardCvv ? 'password' : 'tel'}
        id="secure-code-input"
        autocomplete="cc-csc"
    />
);

export const SecureCode = ({ locale, obscureCardCvv, cardNumber }: SecureCodeProps) => (
    <Field
        name="secureCode"
        component={WrappedInput}
        props={{ locale, obscureCardCvv, cardNumber }}
        validate={validateSecureCode}
        normalize={(value, _p, { cardNumber }) => formatCVC(value, cardNumber)}
    />
);
