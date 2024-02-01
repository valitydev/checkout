import { createInvoiceWithTemplate as request } from 'checkout/backend';

import { PaymentModelInvoice, PaymentModelInvoiceTemplate } from '../paymentModel';

export const createInvoiceWithTemplate = async (model: PaymentModelInvoiceTemplate): Promise<PaymentModelInvoice> => {
    const {
        apiEndpoint,
        metadata,
        paymentAmount,
        invoiceTemplateParams: { invoiceTemplateID, invoiceTemplateAccessToken },
    } = model;
    const {
        invoice: { id, externalID, dueDate, status },
        invoiceAccessToken,
    } = await request(apiEndpoint, invoiceTemplateAccessToken, invoiceTemplateID, {
        amount: paymentAmount.value,
        currency: paymentAmount.currency,
        metadata,
    });
    return {
        ...model,
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
