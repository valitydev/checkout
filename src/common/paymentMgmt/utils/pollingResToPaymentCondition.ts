import { invoiceChangeToPaymentCondition } from './invoiceChangeToPaymentCondition';
import { PaymentCondition, PaymentInteractionRedirectType } from '../../paymentCondition';
import { PollingResult } from '../pollInvoiceEvents';

export const pollingResToPaymentCondition = (
    pollingResult: PollingResult,
    type: PaymentInteractionRedirectType,
): { condition: PaymentCondition; eventId: number } => {
    switch (pollingResult.status) {
        case 'POLLED':
            return {
                eventId: pollingResult.eventID,
                condition: invoiceChangeToPaymentCondition(pollingResult.change, type),
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
