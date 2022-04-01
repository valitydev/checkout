import { InvoiceEvent, InvoiceStatusChanged, InvoiceStatuses, LogicError, LogicErrorCode } from 'checkout/backend';
import { Locale } from 'checkout/locale';
import { ResultFormContent, ResultFormType } from './result-form-content';
import { getLastChange } from 'checkout/utils';

const refunded = (l: Locale): ResultFormContent => ({
    hasActions: false,
    hasDone: false,
    header: l['form.header.final.invoice.refunded.label'],
    type: ResultFormType.WARNING
});

const alreadyPaid = (l: Locale): ResultFormContent => ({
    hasActions: false,
    hasDone: false,
    header: l['form.header.final.invoice.paid.already.label'],
    type: ResultFormType.SUCCESS
});

const paid = (l: Locale): ResultFormContent => ({
    hasActions: false,
    hasDone: true,
    header: l['form.header.final.invoice.paid.label'],
    type: ResultFormType.SUCCESS
});

const cancelled = (l: Locale): ResultFormContent => ({
    hasActions: false,
    hasDone: false,
    header: l['form.header.final.invoice.cancelled.label'],
    type: ResultFormType.ERROR
});

const fulfilled = (l: Locale): ResultFormContent => ({
    hasActions: false,
    hasDone: false,
    header: l['form.header.final.invoice.fulfilled.label'],
    type: ResultFormType.SUCCESS
});

export const makeFromInvoiceChange = (l: Locale, e: InvoiceEvent[], error: LogicError) => {
    const change = getLastChange(e) as InvoiceStatusChanged;
    switch (change.status) {
        case InvoiceStatuses.paid:
            if (error && error.code === LogicErrorCode.invalidInvoiceStatus) {
                return alreadyPaid(l);
            }
            return paid(l);
        case InvoiceStatuses.cancelled:
            return cancelled(l);
        case InvoiceStatuses.fulfilled:
            return fulfilled(l);
        case InvoiceStatuses.refunded:
            return refunded(l);
    }
    throw new Error('Unsupported InvoiceStatusChange');
};
