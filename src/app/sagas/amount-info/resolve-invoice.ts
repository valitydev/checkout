import { Invoice } from 'checkout/backend';
import { AmountInfoState, AmountInfoStatus } from 'checkout/state';

export const resolveInvoice = ({ amount, currency }: Invoice, locale: string): AmountInfoState => ({
    status: AmountInfoStatus.final,
    minorValue: amount,
    currencyCode: currency,
    locale
});
