import { PollingResult } from 'checkout/paymentMgmt';

import { invoiceEventsToConditions } from './invoiceEventsToConditions';
import { PaymentCondition } from '../types';

export const pollingResultToConditions = (
    pollingResult: PollingResult,
    skipUserInteraction: boolean = false,
    isInstantPayment: boolean = false,
): PaymentCondition[] => {
    switch (pollingResult.status) {
        case 'TIMEOUT':
            return [
                {
                    name: 'paymentStatusUnknown',
                },
            ];
        case 'POLLED':
            return invoiceEventsToConditions(pollingResult.events, skipUserInteraction, isInstantPayment);
    }
};
