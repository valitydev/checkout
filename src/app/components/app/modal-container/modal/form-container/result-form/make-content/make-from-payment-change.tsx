import {
    InvoiceEvent,
    LogicError,
    PaymentError,
    PaymentStatusChanged,
    PaymentStatuses,
    ResponseError,
} from 'checkout/backend';
import { Locale } from 'checkout/locale';
import { getLastChange } from 'checkout/utils';
import isNil from 'checkout/utils/is-nil';

import { getFailedDescription } from './get-failed-description';
import { ResultFormContent } from './result-form-content';
import { ResultFormType } from './result-form-content';

export const refunded = (l: Locale): ResultFormContent => ({
    hasActions: false,
    hasDone: true,
    header: l['form.header.final.refunded.label'],
    type: ResultFormType.WARNING,
});

export const pending = (l: Locale): ResultFormContent => ({
    hasActions: true,
    hasDone: false,
    header: l['form.header.final.pending.label'],
    type: ResultFormType.WARNING,
});

export const cancelled = (l: Locale): ResultFormContent => ({
    hasActions: true,
    hasDone: false,
    header: l['form.header.final.cancelled.label'],
    type: ResultFormType.WARNING,
});

const failed = (l: Locale, e: PaymentError | LogicError): ResultFormContent => ({
    hasActions: true,
    hasDone: false,
    header: l['form.header.final.failed.label'],
    description: getFailedDescription(l, e),
    type: ResultFormType.ERROR,
});

const isResponseErrorWithMessage = (error: ResponseError): error is ResponseError => {
    if (isNil(error)) return false;
    return !isNil(error?.details?.message);
};

const getErrorDescription = (error: ResponseError | Error): string => {
    if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
    }
    if (isResponseErrorWithMessage(error)) {
        return error.details.message;
    }
    return JSON.stringify(error);
};

export const failedHook = (l: Locale, error: ResponseError | Error): ResultFormContent => ({
    hasActions: true,
    hasDone: false,
    header: l['form.header.final.error.label'],
    description: getErrorDescription(error),
    type: ResultFormType.ERROR,
});

const processed = (l: Locale): ResultFormContent => ({
    hasActions: false,
    hasDone: true,
    header: l['form.header.final.success.label'],
    type: ResultFormType.SUCCESS,
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
};

export const makeFromPaymentChangeHook = (l: Locale, change: PaymentStatusChanged) => {
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
};
