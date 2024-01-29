import { createInvoiceWithTemplate as request } from 'checkout/backend';

import { PaymentModelInvoice, PaymentModelInvoiceTemplate } from '../paymentModel';

export const createInvoiceWithTemplate = async (model: PaymentModelInvoiceTemplate): Promise<PaymentModelInvoice> => {
    const params = {
        amount: model.paymentAmount.value,
        currency: model.paymentAmount.currency,
        metadata: model.metadata,
    };
    const { invoiceTemplateID, invoiceTemplateAccessToken } = model.invoiceTemplateParams;
    const { invoice, invoiceAccessToken } = await request(
        model.apiEndpoint,
        invoiceTemplateAccessToken,
        invoiceTemplateID,
        params,
    );
    return {
        ...model,
        type: 'InvoiceContext',
        invoiceParams: {
            invoiceID: invoice.id,
            invoiceAccessToken: invoiceAccessToken.payload,
        },
        externalID: invoice.externalID,
        dueDate: invoice.dueDate,
    };
};
