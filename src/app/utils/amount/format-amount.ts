import * as Currencies from '@dinero.js/currencies';

import { AmountInfo } from 'checkout/hooks';

const getAmountByExponent = ({ minorValue, currencyCode }: AmountInfo): number =>
    minorValue / Number('1e' + Currencies[currencyCode].exponent);

export const formatAmount = (amount: AmountInfo): string | null => {
    return amount && amount.minorValue
        ? new Intl.NumberFormat(amount.locale, {
              style: 'currency',
              currency: amount.currencyCode,
          }).format(getAmountByExponent(amount))
        : null;
};
