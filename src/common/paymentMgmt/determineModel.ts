import { createInvoiceWithTemplate } from './createInvoiceWithTemplate';
import { PaymentModel, PaymentModelInvoice } from '../paymentModel';

export const determineModel = (model: PaymentModel): Promise<PaymentModelInvoice> => {
    switch (model.type) {
        case 'InvoiceTemplateContext':
            return createInvoiceWithTemplate(model);
        case 'InvoiceContext':
            return Promise.resolve(model);
    }
};
