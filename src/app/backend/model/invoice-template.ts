import { InvoiceTemplateDetails } from './invoice-template-details/invoice-template-details';
import { LifetimeInterval } from './invoice-template-details/lifetime-interval';

export class InvoiceTemplate {
    id: string;
    shopID: string;
    product: string;
    description: string;
    lifetime: LifetimeInterval;
    details: InvoiceTemplateDetails;
    metadata: object;
}
