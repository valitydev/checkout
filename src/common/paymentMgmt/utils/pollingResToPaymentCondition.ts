import { invoiceChangeToPaymentCondition } from './invoiceChangeToPaymentCondition';
import { PaymentCondition } from '../../paymentCondition';
import { PollingResult } from '../pollInvoiceEvents';

export const pollingResToPaymentCondition = (
    pollingResult: PollingResult,
    provider: string | null,
): { condition: PaymentCondition; eventId: number } => {
    switch (pollingResult.status) {
        case 'POLLED':
            return {
                eventId: pollingResult.eventID,
                condition: invoiceChangeToPaymentCondition(pollingResult.change, provider),
            };
        case 'TIMEOUT':
            return {
                eventId: 0,
                condition: {
                    name: 'paymentProcessFailed',
                    exception: {
                        type: 'PollingTimeoutException',
                    },
                },
            };
    }
};
