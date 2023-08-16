import { PaymentError } from 'checkout/backend';

import { InvoiceChange } from './invoice-change';
import { InvoiceChangeType } from './invoice-change-type';

export enum PaymentStatuses {
    processed = 'processed',
    failed = 'failed',
    cancelled = 'cancelled',
    pending = 'pending',
    captured = 'captured',
    refunded = 'refunded',
}

export class PaymentStatusChanged extends InvoiceChange {
    changeType = InvoiceChangeType.PaymentStatusChanged;
    status: PaymentStatuses;
    paymentID: string;
    error: PaymentError;
}
