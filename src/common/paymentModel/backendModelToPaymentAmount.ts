import { BackendModel, BackendModelInvoice, BackendModelInvoiceTemplate } from './getBackendModel';
import { PaymentAmount } from './types';
import { InvoiceTemplateLineCostFixed, InvoiceTemplateMultiLine, InvoiceTemplateSingleLine } from '../backend/payments';

const fromInvoiceTemplateMultiLine = (details: InvoiceTemplateMultiLine): PaymentAmount => ({
    value: details.cart.reduce((p, c) => p + c.price * c.quantity, 0),
    currency: details.currency,
});

const fromInvoiceTemplateLineCostFixed = (fixed: InvoiceTemplateLineCostFixed): PaymentAmount => ({
    value: fixed.amount,
    currency: fixed.currency,
});

export const fromInvoiceTemplateSingleLine = (details: InvoiceTemplateSingleLine): PaymentAmount => {
    const price = details.price;
    switch (price.costType) {
        case 'InvoiceTemplateLineCostFixed':
            return fromInvoiceTemplateLineCostFixed(price as InvoiceTemplateLineCostFixed);
        case 'InvoiceTemplateLineCostRange':
        case 'InvoiceTemplateLineCostUnlim':
            throw new Error(`Unsupported invoice template cost type: ${price.costType}`);
    }
};

const fromInvoiceTemplate = ({ invoiceTemplate }: BackendModelInvoiceTemplate): PaymentAmount => {
    const details = invoiceTemplate.details;
    switch (details.templateType) {
        case 'InvoiceTemplateMultiLine':
            return fromInvoiceTemplateMultiLine(details as InvoiceTemplateMultiLine);
        case 'InvoiceTemplateSingleLine':
            return fromInvoiceTemplateSingleLine(details as InvoiceTemplateSingleLine);
    }
};

const fromInvoice = ({ invoice: { amount, currency } }: BackendModelInvoice): PaymentAmount => ({
    value: amount,
    currency,
});

export const backendModelToPaymentAmount = (model: BackendModel): PaymentAmount => {
    switch (model.type) {
        case 'BackendModelInvoice':
            return fromInvoice(model);
        case 'BackendModelInvoiceTemplate':
            return fromInvoiceTemplate(model);
    }
};
