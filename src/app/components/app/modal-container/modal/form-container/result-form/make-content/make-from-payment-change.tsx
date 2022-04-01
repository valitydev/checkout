import { Locale } from 'checkout/locale';
import { InvoiceEvent, LogicError, PaymentError, PaymentStatusChanged, PaymentStatuses } from 'checkout/backend';
import { ResultFormContent } from './result-form-content';
import { getFailedDescription } from './get-failed-description';
import { getLastChange } from 'checkout/utils';
import { ResultFormType } from './result-form-content';

export const refunded = (l: Locale): ResultFormContent => ({
    hasActions: false,
    hasDone: true,
    header: l['form.header.final.refunded.label'],
    type: ResultFormType.WARNING
});

export const pending = (l: Locale): ResultFormContent => ({
    hasActions: false,
    hasDone: false,
    header: l['form.header.final.pending.label'],
    type: ResultFormType.WARNING
});

export const cancelled = (l: Locale): ResultFormContent => ({
    hasActions: true,
    hasDone: false,
    header: l['form.header.final.cancelled.label'],
    type: ResultFormType.WARNING
});

export const failed = (l: Locale, e: PaymentError | LogicError): ResultFormContent => ({
    hasActions: true,
    hasDone: false,
    header: l['form.header.final.failed.label'],
    description: getFailedDescription(l, e),
    type: ResultFormType.ERROR
});

const processed = (l: Locale): ResultFormContent => ({
    hasActions: false,
    hasDone: true,
    header: l['form.header.final.success.label'],
    type: ResultFormType.SUCCESS
});

export const makeFromPaymentChange = (l: Locale, e: InvoiceEvent[]) => {
    const change = getLastChange(e) as PaymentStatusChanged;
    switch (change.status) {
        case PaymentStatuses.failed:
            return failed(l, change.error);
        case PaymentStatuses.processed:
        case PaymentStatuses.captured:
            return processed(l);
        case PaymentStatuses.cancelled:
            return cancelled(l);
        case PaymentStatuses.pending:
            return pending(l);
        case PaymentStatuses.refunded:
            return refunded(l);
    }
    throw new Error('Unsupported PaymentStatusChanged');
};
