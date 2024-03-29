import { invoiceEventsToConditions } from './invoiceEventsToConditions';
import { PollingResult } from '../../paymentMgmt';
import { PaymentCondition } from '../types';

export const pollingResultToConditions = (
    pollingResult: PollingResult,
    skipUserInteraction: boolean = false,
): PaymentCondition[] => {
    switch (pollingResult.status) {
        case 'TIMEOUT':
            return [
                {
                    name: 'paymentStatusUnknown',
                },
            ];
        case 'POLLED':
            return invoiceEventsToConditions(pollingResult.events, skipUserInteraction);
    }
};
