import { createInvoiceWithTemplate as request } from 'checkout/backend';

import { invoiceToInvoiceContext } from './invoiceToInvoiceContext';
import { InvoiceContext, PaymentModelInvoiceTemplate } from '../paymentModel';

export const createInvoiceWithTemplate = async (model: PaymentModelInvoiceTemplate): Promise<InvoiceContext> => {
    const {
        apiEndpoint,
        metadata,
        paymentAmount,
        invoiceTemplateParams: { invoiceTemplateID, invoiceTemplateAccessToken },
    } = model;
    const invoiceAndToken = await request(apiEndpoint, invoiceTemplateAccessToken, invoiceTemplateID, {
        amount: paymentAmount.value,
        currency: paymentAmount.currency,
        metadata,
    });
    return invoiceToInvoiceContext(invoiceAndToken);
};
