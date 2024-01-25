import * as Currencies from '@dinero.js/currencies';

import { PaymentAmount } from '../paymentModel';

const getAmountByExponent = ({ value, currency }: PaymentAmount): number =>
    value / Number('1e' + Currencies[currency].exponent);

export const formatAmount = (paymentAmount: PaymentAmount, localeCode: string): string =>
    new Intl.NumberFormat(localeCode, {
        style: 'currency',
        currency: paymentAmount.currency,
    }).format(getAmountByExponent(paymentAmount));
