import * as React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

import { validateExpireDate } from './validate-expire-date';
import { Locale } from 'checkout/locale';
import { formatExpiry } from './format-expiry';
import { Input } from 'checkout/components';
import { CardFormInputs } from '../../card-form-inputs';
import isNil from 'checkout/utils/is-nil';
import { ReactComponent as CalendarIcon } from '../../../../../../../ui/icon/calendar.svg';

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
        icon={<CalendarIcon />}
        placeholder={locale['form.input.expiry.placeholder']}
        mark={true}
        type="tel"
        id="expire-date-input"
        onInput={formatExpiry}
        autoComplete="cc-exp"
        error={!isNil(fieldError)}
        dirty={isDirty}
    />
);
