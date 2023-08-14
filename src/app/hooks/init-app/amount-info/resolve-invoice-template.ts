import { InvoiceTemplate, InvoiceTemplateMultiLine, InvoiceTemplateSingleLine, TemplateType } from 'checkout/backend';
import { getAmountFromSingleLine } from './get-amount-from-single-line';
import { getAmountFromMultiLine } from './get-amount-from-multi-line';
import { AmountInfo } from './types';

export const resolveInvoiceTemplate = (
    invoiceTemplate: InvoiceTemplate,
    configAmount: number,
    locale: string,
): AmountInfo => {
    switch (invoiceTemplate.details.templateType) {
        case TemplateType.InvoiceTemplateSingleLine:
            return getAmountFromSingleLine(invoiceTemplate.details as InvoiceTemplateSingleLine, configAmount, locale);
        case TemplateType.InvoiceTemplateMultiLine:
            return getAmountFromMultiLine(invoiceTemplate.details as InvoiceTemplateMultiLine, locale);
    }
};
