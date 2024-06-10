import { invoiceToInvoiceContext } from './invoiceToInvoiceContext';
import { createInvoiceWithTemplate as request } from '../backend/payments';
import { InvoiceContext, PaymentModelInvoiceTemplate } from '../paymentModel';

export const createInvoiceWithTemplate = async (model: PaymentModelInvoiceTemplate): Promise<InvoiceContext> => {
    const {
        apiEndpoint,
        metadata,
        paymentAmount,
        externalID,
        invoiceTemplateParams: { invoiceTemplateID, invoiceTemplateAccessToken },
    } = model;
    const invoiceAndToken = await request(apiEndpoint, invoiceTemplateAccessToken, invoiceTemplateID, {
        amount: paymentAmount.value,
        currency: paymentAmount.currency,
        metadata,
        externalID,
    });
    return invoiceToInvoiceContext(invoiceAndToken);
};
