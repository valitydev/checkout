import * as React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

import { InvoiceTemplateLineCostRange, InvoiceTemplateLineCostUnlim } from 'checkout/backend';
import { Input } from 'checkout/components';
import { Locale } from 'checkout/locale';
import isNil from 'checkout/utils/is-nil';

import { formatAmount } from './format-amount';
import { getPlaceholder } from './get-placeholder';
import { validateAmount } from './validate-amount';
import { ReactComponent as AmountIcon } from '../../../../../../ui/icon/amount.svg';

export type AmountProps = {
    register: UseFormRegister<any>;
    cost: InvoiceTemplateLineCostRange | InvoiceTemplateLineCostUnlim;
    locale: Locale;
    localeCode: string;
    fieldError: FieldError;
    isDirty: boolean;
};

export const Amount = ({ register, locale, fieldError, cost, localeCode, isDirty }: AmountProps) => (
    <Input
        {...register('amount', {
            required: true,
            validate: (value) => !validateAmount(value, cost) || 'Amount is invalid',
        })}
        dirty={isDirty}
        error={!isNil(fieldError)}
        icon={<AmountIcon />}
        id="amount-input"
        mark={true}
        placeholder={getPlaceholder(cost, locale['form.input.amount.placeholder'], localeCode)}
        type="tel"
        onInput={formatAmount}
    />
);
