import { InvoiceTemplateLineCost } from './invoice-template-line-cost';

export class InvoiceTemplateLineCostFixed extends InvoiceTemplateLineCost {
    amount: number;
    currency: string;
}
