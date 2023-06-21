import * as React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

import { validateCardHolder } from './validate-card-holder';
import { Locale } from 'checkout/locale';
import { formatCardHolder } from './format-card-holder';
import { User, Input } from 'checkout/components';
import { CardFormInputs } from '../../card-form-inputs';
import isNil from 'checkout/utils/is-nil';

export type CardHolderProps = {
    register: UseFormRegister<CardFormInputs>;
    locale: Locale;
    fieldError: FieldError;
    isDirty: boolean;
};

export const CardHolder = ({ register, locale, fieldError, isDirty }: CardHolderProps) => (
    <Input
        {...register('cardHolder', {
            required: true,
            validate: (value) => !validateCardHolder(value) || 'Card holder is invalid'
        })}
        icon={<User />}
        placeholder={locale['form.input.cardholder.placeholder']}
        mark={true}
        id="card-holder-input"
        onInput={formatCardHolder}
        autocomplete="cc-name"
        spellcheck={false}
        error={!isNil(fieldError)}
        dirty={isDirty}
    />
);
