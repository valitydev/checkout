import { InvoiceAndToken } from '../backend/payments';
import { InvoiceContext } from '../paymentModel';

export const invoiceToInvoiceContext = ({
    invoice: { id, externalID, dueDate, status },
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
});
