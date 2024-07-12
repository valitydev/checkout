import { FieldError, UseFormRegister, UseFormWatch } from 'react-hook-form';
import styled from 'styled-components';

import { formatCardNumber } from './formatCardNumber';
import { validateCardNumber } from './validateCardNumber';
import { Locale } from '../../../../../common/contexts';
import { isNil } from '../../../../../common/utils';
import { Input } from '../../../../legacy';
import { CardFormInputs } from '../types';

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

export const CardNumber = ({ register, locale, fieldError, isDirty }: CardNumberProps) => (
    <InputContainer>
        <CardNumberInput
            {...register('cardNumber', {
                required: true,
                validate: (value) => !validateCardNumber(value) || 'Card number is invalid',
            })}
            autoComplete="cc-number"
            dirty={isDirty}
            error={!isNil(fieldError)}
            // icon={<CardIcon />}
            id="card-number-input"
            mark={true}
            placeholder={locale['form.input.card.placeholder']}
            type="tel"
            onInput={formatCardNumber}
        />
        {/* <CardTypeIcon cardNumber={watch('cardNumber')} /> */}
    </InputContainer>
);
