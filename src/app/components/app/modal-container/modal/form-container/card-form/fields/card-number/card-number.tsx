import * as React from 'react';
import { FieldError, UseFormRegister, UseFormWatch } from 'react-hook-form';

import { CardTypeIcon } from './card-type-icon';
import { validateCardNumber } from './validate-card-number';
import { Card, Input } from 'checkout/components';
import { Locale } from 'checkout/locale';
import { formatCardNumber } from './format-card-number';
import styled from 'checkout/styled-components';
import isNil from 'checkout/utils/is-nil';
import { CardFormInputs } from '../../card-form-inputs';

const InputContainer = styled.div`
    width: 100%;
    position: relative;
`;

const CardNumberInput = styled(Input)`
    input {
        padding-right: 50px !important;
    }
`;

export type CardNumberProps = {
    register: UseFormRegister<CardFormInputs>;
    watch: UseFormWatch<CardFormInputs>;
    locale: Locale;
    fieldError: FieldError;
    isDirty: boolean;
};

export const CardNumber = ({ register, locale, fieldError, isDirty, watch }: CardNumberProps) => (
    <InputContainer>
        <CardNumberInput
            {...register('cardNumber', {
                required: true,
                validate: (value) => !validateCardNumber(value) || 'Card number is invalid'
            })}
            icon={<Card />}
            placeholder={locale['form.input.card.placeholder']}
            mark={true}
            type="tel"
            id="card-number-input"
            onInput={formatCardNumber}
            autocomplete="cc-number"
            error={!isNil(fieldError)}
            dirty={isDirty}
        />
        <CardTypeIcon cardNumber={watch('cardNumber')} />
    </InputContainer>
);
