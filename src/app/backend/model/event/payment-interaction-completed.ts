import { InvoiceChange } from './invoice-change';
import { InvoiceChangeType } from './invoice-change-type';
import { UserInteraction } from './user-interaction';

export class PaymentInteractionCompleted extends InvoiceChange {
    changeType = InvoiceChangeType.PaymentInteractionCompleted;
    paymentID: string;
    userInteraction: UserInteraction;
}
