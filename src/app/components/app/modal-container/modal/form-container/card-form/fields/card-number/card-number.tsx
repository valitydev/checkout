import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';

import { CardTypeIcon } from './card-type-icon';
import { validateCardNumber } from './validate-card-number';
import { Card, Input } from 'checkout/components';
import { Locale } from 'checkout/locale';
import { formatCardNumber } from './format-card-number';
import styled from 'checkout/styled-components';
import { isError } from 'checkout/utils';

const InputContainer = styled.div`
    width: 100%;
    position: relative;
`;

const CardNumberInput = styled(Input)`
    input {
        padding-right: 50px !important;
    }
`;

export interface CardNumberProps {
    locale: Locale;
}

const WrappedInput = ({ input, meta, locale }: WrappedFieldProps & CardNumberProps) => (
    <CardNumberInput
        {...input}
        {...meta}
        error={isError(meta)}
        icon={<Card />}
        placeholder={locale['form.input.card.placeholder']}
        mark={true}
        type="tel"
        id="card-number-input"
        onInput={formatCardNumber}
        autocomplete="cc-number"
    />
);

export const CardNumber = ({ locale }: CardNumberProps) => (
    <InputContainer>
        <Field name="cardNumber" component={WrappedInput} props={{ locale }} validate={validateCardNumber} />
        <CardTypeIcon />
    </InputContainer>
);
