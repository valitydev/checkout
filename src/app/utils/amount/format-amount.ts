import * as Currencies from '@dinero.js/currencies';

import { AmountInfoState } from 'checkout/state';

const getAmountByExponent = ({ minorValue, currencyCode }: AmountInfoState): number =>
    minorValue / Number('1e' + Currencies[currencyCode].exponent);

export const formatAmount = (amount: AmountInfoState): string | null => {
    return amount && amount.minorValue
        ? new Intl.NumberFormat(amount.locale, { style: 'currency', currency: amount.currencyCode }).format(
              getAmountByExponent(amount)
          )
        : null;
};
