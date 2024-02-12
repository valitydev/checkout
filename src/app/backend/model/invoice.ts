import { InvoiceStatuses } from './event';
import { InvoiceLine } from './invoice-cart/invoice-line';

export class Invoice {
    id: string;
    shopID: string;
    invoiceTemplateID: string;
    createdAt: string;
    dueDate: string;
    amount: number;
    currency: string;
    metadata: object;
    product: string;
    description: string;
    status: InvoiceStatuses;
    reason: string;
    cart: InvoiceLine[];
    externalID: string;
}
