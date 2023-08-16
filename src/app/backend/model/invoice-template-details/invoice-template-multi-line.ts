import { InvoiceTemplateDetails } from './invoice-template-details';
import { InvoiceLine } from '../invoice-cart/invoice-line';

export class InvoiceTemplateMultiLine extends InvoiceTemplateDetails {
    cart: InvoiceLine[];
    currency: string;
}
