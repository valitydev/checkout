import {
    CostType,
    InvoiceTemplateLineCostFixed,
    InvoiceTemplateMultiLine,
    InvoiceTemplateSingleLine,
    TemplateType,
} from 'checkout/backend';

import { BackendModel, BackendModelInvoice, BackendModelInvoiceTemplate } from './getBackendModel';
import { PaymentAmount } from './types';

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
        case CostType.InvoiceTemplateLineCostFixed:
            return fromInvoiceTemplateLineCostFixed(price as InvoiceTemplateLineCostFixed);
        case CostType.InvoiceTemplateLineCostRange:
        case CostType.InvoiceTemplateLineCostUnlim:
            throw new Error(`Unsupported invoice template cost type: ${price.costType}`);
    }
};

const fromInvoiceTemplate = ({ invoiceTemplate }: BackendModelInvoiceTemplate): PaymentAmount => {
    const details = invoiceTemplate.details;
    switch (details.templateType) {
        case TemplateType.InvoiceTemplateMultiLine:
            return fromInvoiceTemplateMultiLine(details as InvoiceTemplateMultiLine);
        case TemplateType.InvoiceTemplateSingleLine:
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
