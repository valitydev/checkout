import { InvoiceChange } from './invoice-change';
import { InvoiceChangeType } from './invoice-change-type';
import { Payment } from '../payment';

export class PaymentStarted extends InvoiceChange {
    changeType = InvoiceChangeType.PaymentStarted;
    payment: Payment;
}
