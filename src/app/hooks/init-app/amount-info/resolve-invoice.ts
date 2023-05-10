import { Invoice } from 'checkout/backend';
import { AmountInfo } from './types';

export const resolveInvoice = ({ amount, currency }: Invoice, locale: string): AmountInfo => ({
    status: 'final',
    minorValue: amount,
    currencyCode: currency,
    locale
});
