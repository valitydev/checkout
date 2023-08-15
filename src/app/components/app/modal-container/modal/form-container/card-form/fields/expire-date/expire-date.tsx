import * as React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

import { Input } from 'checkout/components';
import { Locale } from 'checkout/locale';
import isNil from 'checkout/utils/is-nil';

import { formatExpiry } from './format-expiry';
import { validateExpireDate } from './validate-expire-date';
import { ReactComponent as CalendarIcon } from '../../../../../../../ui/icon/calendar.svg';
import { CardFormInputs } from '../../card-form-inputs';

export type ExpireDateProps = {
    register: UseFormRegister<CardFormInputs>;
    locale: Locale;
    fieldError: FieldError;
    isDirty: boolean;
};

export const ExpireDate = ({ register, locale, fieldError, isDirty }: ExpireDateProps) => (
    <Input
        {...register('expireDate', {
            required: true,
            validate: (value) => !validateExpireDate(value) || 'Exp date is invalid',
        })}
        autoComplete="cc-exp"
        dirty={isDirty}
        error={!isNil(fieldError)}
        icon={<CalendarIcon />}
        id="expire-date-input"
        mark={true}
        placeholder={locale['form.input.expiry.placeholder']}
        type="tel"
        onInput={formatExpiry}
    />
);
