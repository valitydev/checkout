import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';

import { Input } from 'checkout/components';
import { getPlaceholder } from './get-placeholder';
import { validateAmount } from './validate-amount';
import { Locale } from 'checkout/locale';
import { InvoiceTemplateLineCostRange, InvoiceTemplateLineCostUnlim } from 'checkout/backend';
import { formatAmount } from './format-amount';
import { Amount as AmountIcon } from 'checkout/components';
import { isError } from 'checkout/utils';

export interface AmountProps {
    cost: InvoiceTemplateLineCostRange | InvoiceTemplateLineCostUnlim;
    locale: Locale;
    localeCode: string;
}

const WrappedInput = ({ input, meta, locale, cost, localeCode }: WrappedFieldProps & AmountProps) => (
    <Input
        {...input}
        {...meta}
        icon={<AmountIcon />}
        error={isError(meta)}
        placeholder={getPlaceholder(cost, locale['form.input.amount.placeholder'], localeCode)}
        mark={true}
        type="tel"
        id="amount-input"
        onInput={formatAmount}
    />
);

export const Amount = ({ cost, locale, localeCode }: AmountProps) => (
    <Field
        name="amount"
        component={WrappedInput}
        props={{ locale, cost, localeCode }}
        validate={(value) => validateAmount(value, cost)}
    />
);
