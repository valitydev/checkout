import { InvoiceStatuses, PaymentStatuses } from 'checkout/backend';

import { InvoiceStatusChanged, PaymentCondition, PaymentStatusChanged } from '../../../../common/paymentCondition';
import { ResultInfo } from '../types';

const fromInvoiceStatusChanged = (condition: InvoiceStatusChanged): ResultInfo => {
    switch (condition.status) {
        case InvoiceStatuses.paid:
            return {
                iconName: 'SuccessIcon',
                label: 'form.header.final.invoice.paid.label',
            };
        case InvoiceStatuses.cancelled:
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.invoice.cancelled.label',
            };
        case InvoiceStatuses.fulfilled:
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.invoice.fulfilled.label',
            };
        case InvoiceStatuses.refunded:
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.invoice.refunded.label',
            };
    }
};

const fromPaymentStatusChanged = (condition: PaymentStatusChanged): ResultInfo => {
    switch (condition.status) {
        case PaymentStatuses.captured:
        case PaymentStatuses.processed:
            return {
                iconName: 'SuccessIcon',
                label: 'form.header.final.success.label',
            };
        case PaymentStatuses.cancelled:
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.cancelled.label',
            };
        case PaymentStatuses.refunded:
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.refunded.label',
            };
        case PaymentStatuses.pending:
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.pending.label',
                description: 'form.header.final.pending.description',
                hasActions: true,
            };
        case PaymentStatuses.failed:
            const error = condition.error;
            return {
                iconName: 'ErrorIcon',
                label: 'form.header.final.failed.label',
                description: error?.code,
                hasActions: true,
            };
    }
};

export const getResultInfo = (condition: PaymentCondition): ResultInfo => {
    switch (condition.name) {
        case 'invoiceStatusChanged':
            return fromInvoiceStatusChanged(condition);
        case 'paymentStatusChanged':
            return fromPaymentStatusChanged(condition);
        case 'paymentStatusUnknown':
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.pending.label',
                description: 'form.header.final.pending.description',
            };
        case 'interactionCompleted':
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.pending.label',
                description: 'form.header.final.pending.description',
            };
        case 'paymentStarted':
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.pending.label',
                description: 'form.header.final.pending.description',
            };
    }
};
