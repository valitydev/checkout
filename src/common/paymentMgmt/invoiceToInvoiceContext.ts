import { isNil } from 'checkout/utils';

import { InvoiceAndToken } from '../backend/payments';
import { InvoiceContext } from '../paymentModel';

export const invoiceToInvoiceContext = ({
    invoice: { id, externalID, dueDate, status, amountRandomized },
    invoiceAccessToken,
}: InvoiceAndToken): InvoiceContext => ({
    type: 'InvoiceContext',
    invoiceParams: {
        invoiceID: id,
        invoiceAccessToken: invoiceAccessToken.payload,
    },
    externalID,
    dueDate,
    status,
    isAmountRandomized: !isNil(amountRandomized),
});
