import { AmountInfoState } from 'checkout/state';

export const formatAmount = (amount: AmountInfoState): string | null =>
    amount && amount.minorValue
        ? new Intl.NumberFormat(amount.locale, { style: 'currency', currency: amount.currencyCode }).format(
              amount.minorValue / 100
          )
        : null;
