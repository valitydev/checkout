import { InvoiceTemplateMultiLine } from 'checkout/backend';

import { AmountInfo } from './types';

export const getAmountFromMultiLine = (details: InvoiceTemplateMultiLine, locale: string): AmountInfo => ({
    status: 'final',
    minorValue: details.cart.reduce((p, c) => p + c.price * c.quantity, 0),
    currencyCode: details.currency,
    locale,
});
