import { createInvoiceWithTemplate } from './createInvoiceWithTemplate';
import { InvoiceContext, PaymentModel } from '../paymentModel';

export const determineModel = (model: PaymentModel): Promise<InvoiceContext> => {
    switch (model.type) {
        case 'InvoiceTemplateContext':
            return createInvoiceWithTemplate(model);
        case 'InvoiceContext':
            return Promise.resolve(model);
    }
};
