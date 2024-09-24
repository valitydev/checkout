import { useEffect } from 'react';

import { InvoiceStatusChanged, PaymentCondition, PaymentStatusChanged } from 'checkout/paymentCondition';
import { last, sendPostMessage } from 'checkout/utils';

const handlePaymentStatusChanged = (condition: PaymentStatusChanged) => {
    switch (condition.status) {
        case 'captured':
        case 'processed':
            sendPostMessage('onSuccess');
            break;
        case 'failed':
            sendPostMessage('onError');
            break;
    }
};

const handleInvoiceStatusChanged = (condition: InvoiceStatusChanged) => {
    switch (condition.status) {
        case 'paid':
            sendPostMessage('onSuccess');
            break;
    }
};

export function usePostMessage(conditions: PaymentCondition[]) {
    useEffect(() => {
        const lastCondition = last(conditions);
        switch (lastCondition.name) {
            case 'paymentProcessFailed':
                sendPostMessage('onError');
                break;
            case 'paymentStatusChanged':
                handlePaymentStatusChanged(lastCondition);
                break;
            case 'invoiceStatusChanged':
                handleInvoiceStatusChanged(lastCondition);
                break;
        }
    }, [conditions]);
}
