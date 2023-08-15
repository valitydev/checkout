import * as React from 'react';
import { FieldError, UseFormRegister, UseFormWatch } from 'react-hook-form';
import styled from 'styled-components';

import { Input } from 'checkout/components';
import { CardTypeIcon } from 'checkout/components/ui/card-type-icon';
import { Locale } from 'checkout/locale';
import isNil from 'checkout/utils/is-nil';

import { formatCardNumber } from './format-card-number';
import { validateCardNumber } from './validate-card-number';
import { ReactComponent as CardIcon } from '../../../../../../../ui/icon/card.svg';
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
                validate: (value) => !validateCardNumber(value) || 'Card number is invalid',
            })}
            autoComplete="cc-number"
            dirty={isDirty}
            error={!isNil(fieldError)}
            icon={<CardIcon />}
            id="card-number-input"
            mark={true}
            placeholder={locale['form.input.card.placeholder']}
            type="tel"
            onInput={formatCardNumber}
        />
        <CardTypeIcon cardNumber={watch('cardNumber')} />
    </InputContainer>
);
