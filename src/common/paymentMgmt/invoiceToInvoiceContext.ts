import { InvoiceAndToken } from 'checkout/backend';

import { InvoiceContext } from '../paymentModel';

export const invoiceToInvoiceContext = ({
    invoice: { id, externalID, dueDate, status },
    invoiceAccessToken,
}: InvoiceAndToken): InvoiceContext => {
    return {
        type: 'InvoiceContext',
        invoiceParams: {
            invoiceID: id,
            invoiceAccessToken: invoiceAccessToken.payload,
        },
        externalID,
        dueDate,
        status,
    };
};
