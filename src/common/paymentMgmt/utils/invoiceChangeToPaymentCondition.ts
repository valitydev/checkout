import {
    InvoiceChange,
    InvoiceChangeType,
    InvoiceStatusChanged,
    PaymentInteractionRequested,
    PaymentStatusChanged,
} from 'checkout/backend';

import { applyPaymentInteractionRequested } from './applyPaymentInteractionRequested';
import { PaymentCondition } from '../../paymentCondition';

const applyInvoiceStatusChanged = ({ status }: InvoiceStatusChanged): PaymentCondition => ({
    name: 'invoiceStatusChanged',
    status,
});

const applyPaymentStatusChanged = ({ status, error }: PaymentStatusChanged): PaymentCondition => ({
    name: 'paymentStatusChanged',
    status,
    error,
});

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
