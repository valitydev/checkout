import {
    CheckoutServiceProviderMetadata,
    InvoiceChange,
    InvoiceChangeType,
    InvoiceStatusChanged,
    InvoiceStatuses,
    PaymentInteractionRequested,
    PaymentStatusChanged,
    PaymentStatuses,
} from 'checkout/backend';

import { isNil } from '../../../common/utils';
import { PaymentCondition, PaymentInteractionType } from '../../paymentCondition';
import { PollingResult } from '../pollInvoiceEvents';

const applyInvoiceStatusChanged = (change: InvoiceStatusChanged): PaymentCondition => {
    console.log(`InvoiceStatusChanged: ${change.status}`, change);
    switch (change.status) {
        case InvoiceStatuses.paid:
            return { name: 'processed', status: 'InvoicePaid' };
        case InvoiceStatuses.fulfilled:
            return { name: 'processed', status: 'InvoiceFulfilled' };
        case InvoiceStatuses.cancelled:
        case InvoiceStatuses.refunded:
        case InvoiceStatuses.unpaid:
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

const applyInvoiceChange = (
    change: InvoiceChange,
    metadata: CheckoutServiceProviderMetadata | null,
    defaultInteractionType: PaymentInteractionType = 'self',
): PaymentCondition => {
    switch (change.changeType) {
        case InvoiceChangeType.InvoiceStatusChanged:
            return applyInvoiceStatusChanged(change as InvoiceStatusChanged);
        case InvoiceChangeType.PaymentStatusChanged:
            return applyPaymentStatusChanged(change as PaymentStatusChanged);
        case InvoiceChangeType.PaymentInteractionRequested:
            const type = metadata?.userInteraction?.type;
            return {
                name: 'interactionRequested',
                type: isNil(type) ? defaultInteractionType : type,
                interaction: (change as PaymentInteractionRequested).userInteraction,
            };
    }
};

export const pollingResToPaymentCondition = (
    pollingResult: PollingResult,
    metadata: CheckoutServiceProviderMetadata | null,
): { condition: PaymentCondition; eventId: number } => {
    switch (pollingResult.status) {
        case 'POLLED':
            return {
                eventId: pollingResult.eventID,
                condition: applyInvoiceChange(pollingResult.change, metadata),
            };
        case 'TIMEOUT':
            return {
                eventId: 0,
                condition: {
                    name: 'paymentProcessFailed',
                    exception: {
                        type: 'PollingTimeoutException',
                    },
                },
            };
    }
};
