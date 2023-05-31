import {
    InvoiceEvent,
    InvoiceChangeType,
    LogicError,
    InvoiceChange,
    InvoiceStatusChanged,
    PaymentStatusChanged
} from 'checkout/backend';
import { Locale } from 'checkout/locale';
import { getLastChange } from 'checkout/utils';
import { ResultFormContent } from './result-form-content';
import { makeFromInvoiceChange, makeFromInvoiceChangeHook } from './make-from-invoice-change';
import { makeFromPaymentChange, makeFromPaymentChangeHook, pending } from './make-from-payment-change';
import { makeFromPaymentStarted } from './make-from-payment-started';
import { EventsStatus } from 'checkout/state';

export const makeContentInvoice = (
    l: Locale,
    e: InvoiceEvent[],
    eventsStatus: EventsStatus,
    error: LogicError
): ResultFormContent => {
    switch (eventsStatus) {
        case EventsStatus.init:
        case EventsStatus.polled:
            const change = getLastChange(e);
            switch (change.changeType) {
                case InvoiceChangeType.InvoiceStatusChanged:
                    return makeFromInvoiceChange(l, e, error);
                case InvoiceChangeType.PaymentStatusChanged:
                    return makeFromPaymentChange(l, e);
                case InvoiceChangeType.PaymentStarted:
                    return makeFromPaymentStarted(l);
                case InvoiceChangeType.PaymentInteractionRequested:
                    return makeFromPaymentStarted(l);
            }
            throw new Error('Unsupported invoice ChangeType');
        case EventsStatus.timeout:
            return pending(l);
    }
    throw new Error('Unsupported eventsStatus');
};

export const makeContentInvoiceHook = (l: Locale, change: InvoiceChange): ResultFormContent => {
    switch (change.changeType) {
        case InvoiceChangeType.InvoiceStatusChanged:
            return makeFromInvoiceChangeHook(l, change as InvoiceStatusChanged);
        case InvoiceChangeType.PaymentStatusChanged:
            return makeFromPaymentChangeHook(l, change as PaymentStatusChanged);
        case InvoiceChangeType.PaymentStarted:
            return makeFromPaymentStarted(l);
        case InvoiceChangeType.PaymentInteractionRequested:
            return makeFromPaymentStarted(l);
    }
};
