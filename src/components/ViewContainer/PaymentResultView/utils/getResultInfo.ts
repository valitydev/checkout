import { InvoiceStatusChanged, PaymentCondition, PaymentStatusChanged } from '../../../../common/paymentCondition';
import { ResultInfo } from '../types';

const fromInvoiceStatusChanged = (condition: InvoiceStatusChanged): ResultInfo => {
    switch (condition.status) {
        case 'paid':
            return {
                iconName: 'SuccessIcon',
                label: 'form.header.final.invoice.paid.label',
            };
        case 'cancelled':
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.invoice.cancelled.label',
            };
        case 'fulfilled':
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.invoice.fulfilled.label',
            };
    }
};

const fromPaymentStatusChanged = (condition: PaymentStatusChanged): ResultInfo => {
    switch (condition.status) {
        case 'captured':
        case 'processed':
            return {
                iconName: 'SuccessIcon',
                label: 'form.header.final.success.label',
            };
        case 'cancelled':
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.cancelled.label',
            };
        case 'refunded':
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.refunded.label',
            };
        case 'pending':
            return {
                iconName: 'WarningIcon',
                label: 'form.header.final.pending.label',
                description: 'form.header.final.pending.description',
                hasActions: true,
            };
        case 'failed':
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
