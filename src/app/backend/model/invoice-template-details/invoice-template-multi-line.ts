import { InvoiceTemplateDetails } from './invoice-template-details';
import { TemplateType } from './template-type';
import { InvoiceLine } from '../invoice-cart/invoice-line';

export class InvoiceTemplateMultiLine extends InvoiceTemplateDetails {
    templateType: TemplateType.InvoiceTemplateMultiLine;
    cart: InvoiceLine[];
    currency: string;
}
