import * as Currencies from '@dinero.js/currencies';

import { PaymentAmount } from '../paymentModel';

type CurrencyCode = keyof typeof Currencies;

function isCurrencyCode(code: string): code is CurrencyCode {
    return code in Currencies;
}

const getAmountByExponent = ({ value, currency }: PaymentAmount): number => {
    if (!isCurrencyCode(currency)) {
        throw new Error(`Invalid currency code: ${currency}`);
    }
    return value / Number('1e' + Currencies[currency].exponent);
};

export const formatAmount = (paymentAmount: PaymentAmount, localeCode: string): string =>
    new Intl.NumberFormat(localeCode, {
        style: 'currency',
        currency: paymentAmount.currency,
    }).format(getAmountByExponent(paymentAmount));
