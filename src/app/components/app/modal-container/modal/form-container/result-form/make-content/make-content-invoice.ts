import { InvoiceChangeType, InvoiceChange, InvoiceStatusChanged, PaymentStatusChanged } from 'checkout/backend';
import { Locale } from 'checkout/locale';
import { ResultFormContent } from './result-form-content';
import { makeFromInvoiceChangeHook } from './make-from-invoice-change';
import { makeFromPaymentChangeHook } from './make-from-payment-change';
import { makeFromPaymentStarted } from './make-from-payment-started';

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
