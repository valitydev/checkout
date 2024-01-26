import { PaymentCondition } from './types';
import { PaymentModel, PaymentModelInvoiceTemplate } from '../paymentModel';

const fromInvoiceTemplate = async (model: PaymentModelInvoiceTemplate): Promise<PaymentCondition> => {
    if (model.paymentMethods.length > 1) {
        return {
            name: 'uninitialized',
        };
    }
    const paymentMethod = model.paymentMethods[0];
    switch (paymentMethod.name) {
        case 'BankCard':
            return {
                name: 'uninitialized',
            };
        case 'PaymentTerminal':
            throw new Error('Unimplemented PaymentTerminal payment method');
    }
};

export const initPaymentCondition = (model: PaymentModel): Promise<PaymentCondition> => {
    switch (model.type) {
        case 'InvoiceTemplateContext':
            return fromInvoiceTemplate(model);
        case 'InvoiceContext':
            throw new Error('Unimplemented InvoiceContext payment model type');
    }
};
