import { pollInvoiceEvents } from 'checkout/paymentMgmt';
import { PaymentModelInvoice } from 'checkout/paymentModel';

import { pollingResultToConditions } from './pollingResultToConditions';

const DEFAULT_TIMEOUT_MS = 60 * 1000 * 3;
const API_METHOD_CALL_MS = 1000;

export const provideInteractionCompleted = async (model: PaymentModelInvoice, lastEventId: number) => {
    const {
        invoiceParams: { invoiceID, invoiceAccessToken },
        apiEndpoint,
    } = model;
    const pollingResult = await pollInvoiceEvents({
        apiEndpoint,
        invoiceAccessToken,
        invoiceID,
        startFromEventID: lastEventId,
        stopPollingTypes: ['PaymentStatusChanged'],
        delays: {
            pollingTimeout: DEFAULT_TIMEOUT_MS,
            apiMethodCall: API_METHOD_CALL_MS,
        },
    });
    const skipUserInteraction = false;
    const isInstantPayment = false;
    return pollingResultToConditions(pollingResult, skipUserInteraction, isInstantPayment);
};
