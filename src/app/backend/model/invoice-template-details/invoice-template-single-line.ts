import { InvoiceTemplateDetails } from './invoice-template-details';
import { InvoiceTemplateLineCost } from './invoice-template-line-cost';
import { InvoiceLineTaxMode } from '../invoice-cart/invoice-line-tax-mode';

export class InvoiceTemplateSingleLine extends InvoiceTemplateDetails {
    product: string;
    price: InvoiceTemplateLineCost;
    taxMode?: InvoiceLineTaxMode;
}
