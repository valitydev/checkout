import { InvoiceStatusChanged, PaymentCondition, PaymentStatusChanged } from 'checkout/paymentCondition';

import { ResultInfo } from '../types';

const fromInvoiceStatusChanged = (condition: InvoiceStatusChanged): ResultInfo => {
    switch (condition.status) {
        case 'paid':
            return {
                iconName: 'CheckIcon',
                color: 'green.500',
                label: 'form.header.final.invoice.paid.label',
            };
        case 'cancelled':
            return {
                iconName: 'InfoIcon',
                color: 'blue.500',
                label: 'form.header.final.invoice.cancelled.label',
            };
        case 'fulfilled':
            return {
                iconName: 'InfoIcon',
                color: 'blue.500',
                label: 'form.header.final.invoice.fulfilled.label',
            };
    }
};

const fromPaymentStatusChanged = (condition: PaymentStatusChanged): ResultInfo => {
    switch (condition.status) {
        case 'captured':
        case 'processed':
            return {
                iconName: 'CheckIcon',
                color: 'green.500',
                label: 'form.header.final.success.label',
            };
        case 'cancelled':
            return {
                iconName: 'InfoIcon',
                color: 'blue.500',
                label: 'form.header.final.cancelled.label',
            };
        case 'refunded':
            return {
                iconName: 'InfoIcon',
                color: 'blue.500',
                label: 'form.header.final.refunded.label',
            };
        case 'pending':
            return {
                iconName: 'InfoIcon',
                color: 'blue.500',
                label: 'form.header.final.pending.label',
                description: 'form.header.final.pending.description',
            };
        case 'failed':
            const error = condition.error;
            return {
                iconName: 'WarningIcon',
                color: 'red.500',
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
                iconName: 'InfoIcon',
                color: 'blue.500',
                label: 'form.header.final.pending.label',
                description: 'form.header.final.pending.description',
            };
        case 'interactionCompleted':
            return {
                iconName: 'InfoIcon',
                color: 'blue.500',
                label: 'form.header.final.pending.label',
                description: 'form.header.final.pending.description',
            };
        case 'paymentStarted':
            return {
                iconName: 'InfoIcon',
                color: 'blue.500',
                label: 'form.header.final.pending.label',
                description: 'form.header.final.pending.description',
            };
    }
};
