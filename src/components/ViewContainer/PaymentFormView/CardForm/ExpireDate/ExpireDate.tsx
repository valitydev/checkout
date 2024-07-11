import { FieldError, UseFormRegister } from 'react-hook-form';

import { formatExpiry } from './formatExpiry';
import { validateExpireDate } from './validateExpireDate';
import { Locale } from '../../../../../common/contexts';
import { isNil } from '../../../../../common/utils';
import { Input } from '../../../../legacy';
import { ReactComponent as CalendarIcon } from '../../../../legacy/icon/calendar.svg';
import { CardFormInputs } from '../types';

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
        // icon={<CalendarIcon />}
        id="expire-date-input"
        mark={true}
        placeholder={locale['form.input.expiry.placeholder']}
        type="tel"
        onInput={formatExpiry}
    />
);
