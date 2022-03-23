import {
    InvoiceChangeType,
    PaymentInteractionRequested,
    PaymentStatusChanged,
    PaymentStatuses,
    InvoiceEvent,
    PaymentStarted,
    PaymentResourcePayer
} from 'checkout/backend';
import { ModalState, PaymentMethod } from 'checkout/state';
import { PaymentMethodName } from 'checkout/config';
import { provideInteraction } from '../../provide-modal';
import { toModalResult } from './to-modal-result';
import { toInitialState } from './to-initial-state';
import { findChange, getLastChange } from 'checkout/utils';
import { call, CallEffect } from 'redux-saga/effects';

const initFormPaymentStatusChanged = (
    change: PaymentStatusChanged,
    methods: PaymentMethod[],
    initialPaymentMethod: PaymentMethodName
): ModalState => {
    switch (change.status) {
        case PaymentStatuses.captured:
        case PaymentStatuses.processed:
        case PaymentStatuses.pending:
        case PaymentStatuses.refunded:
            return toModalResult();
        case PaymentStatuses.cancelled:
        case PaymentStatuses.failed:
            return toInitialState(methods, initialPaymentMethod);
        default:
            throw { code: 'error.unsupported.payment.status' };
    }
};

export function* initFromInvoiceEvents(
    events: InvoiceEvent[],
    methods: PaymentMethod[],
    initialPaymentMethod: PaymentMethodName
): IterableIterator<ModalState | CallEffect> {
    const change = getLastChange(events);
    switch (change.changeType) {
        case InvoiceChangeType.PaymentInteractionRequested:
            const paymentStarted = findChange<PaymentStarted>(events, 'PaymentStarted');
            const payer = paymentStarted && (paymentStarted?.payment?.payer as PaymentResourcePayer);
            const paymentToolDetails = payer && payer?.paymentToolDetails;
            return yield call(provideInteraction, change as PaymentInteractionRequested, paymentToolDetails);
        case InvoiceChangeType.PaymentStarted:
        case InvoiceChangeType.InvoiceStatusChanged:
            return toModalResult();
        case InvoiceChangeType.PaymentStatusChanged:
            return initFormPaymentStatusChanged(change as PaymentStatusChanged, methods, initialPaymentMethod);
        case InvoiceChangeType.InvoiceCreated:
            return toInitialState(methods, initialPaymentMethod);
        default:
            throw { code: 'error.unsupported.invoice.change.type' };
    }
}
