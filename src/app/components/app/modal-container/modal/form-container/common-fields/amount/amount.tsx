import * as React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

import { Input } from 'checkout/components';
import { getPlaceholder } from './get-placeholder';
import { validateAmount } from './validate-amount';
import { Locale } from 'checkout/locale';
import { InvoiceTemplateLineCostRange, InvoiceTemplateLineCostUnlim } from 'checkout/backend';
import { formatAmount } from './format-amount';
import isNil from 'checkout/utils/is-nil';
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
        icon={<AmountIcon />}
        placeholder={getPlaceholder(cost, locale['form.input.amount.placeholder'], localeCode)}
        mark={true}
        type="tel"
        id="amount-input"
        onInput={formatAmount}
        error={!isNil(fieldError)}
        dirty={isDirty}
    />
);
