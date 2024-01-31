import {
    InvoiceChange,
    InvoiceChangeType,
    InvoiceStatusChanged,
    InvoiceStatuses,
    PaymentInteractionRequested,
    PaymentStatusChanged,
    PaymentStatuses,
} from 'checkout/backend';

import { applyPaymentInteractionRequested } from './applyPaymentInteractionRequested';
import { PaymentCondition } from '../../paymentCondition';

const applyInvoiceStatusChanged = (change: InvoiceStatusChanged): PaymentCondition => {
    console.log(`InvoiceStatusChanged: ${change.status}`, change);
    switch (change.status) {
        case InvoiceStatuses.paid:
            return { name: 'processed', status: 'InvoicePaid' };
        case InvoiceStatuses.fulfilled:
            return { name: 'processed', status: 'InvoiceFulfilled' };
        case InvoiceStatuses.unpaid:
            return { name: 'uninitialized' };
        case InvoiceStatuses.cancelled:
        case InvoiceStatuses.refunded:
            throw new Error(`Unimplemented invoice status: ${change.status}`);
    }
};

const applyPaymentStatusChanged = (change: PaymentStatusChanged): PaymentCondition => {
    console.log(`PaymentStatusChanged: ${change.status}`, change);
    switch (change.status) {
        case PaymentStatuses.captured:
            return { name: 'processed', status: 'PaymentCaptured' };
        case PaymentStatuses.failed:
            return { name: 'paymentFailed', error: change.error };
        case PaymentStatuses.pending:
        case PaymentStatuses.cancelled:
        case PaymentStatuses.processed:
        case PaymentStatuses.refunded:
            throw new Error(`Unimplemented payment status: ${change.status}`);
    }
};

export const invoiceChangeToPaymentCondition = (change: InvoiceChange, provider: string | null): PaymentCondition => {
    switch (change.changeType) {
        case InvoiceChangeType.InvoiceStatusChanged:
            return applyInvoiceStatusChanged(change as InvoiceStatusChanged);
        case InvoiceChangeType.PaymentStatusChanged:
            return applyPaymentStatusChanged(change as PaymentStatusChanged);
        case InvoiceChangeType.PaymentInteractionRequested:
            const userInteraction = (change as PaymentInteractionRequested).userInteraction;
            return applyPaymentInteractionRequested(userInteraction, provider);
    }
};
