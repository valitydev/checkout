import { useCallback, useReducer } from 'react';

import {
    InvoiceChange,
    InvoiceChangeType,
    InvoiceStatusChanged,
    InvoiceStatuses,
    PaymentInteractionRequested,
    PaymentStatusChanged,
    PaymentStatuses,
} from 'checkout/backend';

import { PaymentCondition } from '../../common/paymentCondition';
import {
    PollingResult,
    StartPaymentPayload,
    createPayment,
    determineModel,
    pollInvoiceEvents,
} from '../../common/paymentMgmt';
import { PaymentModel, PaymentModelInvoice } from '../../common/paymentModel';
import { isNil } from '../../common/utils';

type State = {
    condition: PaymentCondition;
    lastEventId: number;
    modelInvoice?: PaymentModelInvoice;
};

type Action =
    | { type: 'SET_CONDITION'; payload: PaymentCondition }
    | { type: 'SET_MODEL_INVOICE'; payload: PaymentModelInvoice }
    | { type: 'SET_LAST_EVENT_ID'; payload: number };

const dataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_CONDITION':
            return {
                ...state,
                condition: action.payload,
            };
        default:
            return state;
    }
};

const API_METHOD_CALL_MS = 1000;
const DEFAULT_TIMEOUT_MS = 60 * 1000 * 20;

const applyInvoiceStatusChanged = (change: InvoiceStatusChanged): PaymentCondition => {
    console.log(`InvoiceStatusChanged: ${change.status}`, change);
    switch (change.status) {
        case InvoiceStatuses.paid:
            return { name: 'processed', status: 'InvoicePaid' };
        case InvoiceStatuses.fulfilled:
            return { name: 'processed', status: 'InvoiceFulfilled' };
        case InvoiceStatuses.cancelled:
        case InvoiceStatuses.refunded:
        case InvoiceStatuses.unpaid:
            throw new Error(`Unimplemented invoice status: ${change.status}`);
    }
};

const applyPaymentStatusChanged = (change: PaymentStatusChanged): PaymentCondition => {
    console.log(`PaymentStatusChanged: ${change.status}`, change);
    switch (change.status) {
        case PaymentStatuses.captured:
            return { name: 'processed', status: 'PaymentCaptured' };
        case PaymentStatuses.failed:
            return { name: 'paymentFailed', error: change.error };
        case PaymentStatuses.pending:
        case PaymentStatuses.cancelled:
        case PaymentStatuses.processed:
        case PaymentStatuses.refunded:
            throw new Error(`Unimplemented payment status: ${change.status}`);
    }
};

const applyInvoiceChange = (change: InvoiceChange): PaymentCondition => {
    switch (change.changeType) {
        case InvoiceChangeType.InvoiceStatusChanged:
            return applyInvoiceStatusChanged(change as InvoiceStatusChanged);
        case InvoiceChangeType.PaymentStatusChanged:
            return applyPaymentStatusChanged(change as PaymentStatusChanged);
        case InvoiceChangeType.PaymentInteractionRequested:
            return {
                name: 'interactionRequested',
                interaction: (change as PaymentInteractionRequested).userInteraction,
            };
    }
};

const applyPollingResult = (pollingResult: PollingResult): { condition: PaymentCondition; eventId: number } => {
    switch (pollingResult.status) {
        case 'POLLED':
            return {
                eventId: pollingResult.eventID,
                condition: applyInvoiceChange(pollingResult.change),
            };
        case 'TIMEOUT':
            return {
                eventId: 0,
                condition: {
                    name: 'paymentProcessFailed',
                    exception: {
                        type: 'pollingTimeout',
                    },
                },
            };
    }
};

export const usePaymentCondition = (model: PaymentModel, initCondition: PaymentCondition) => {
    const [state, dispatch] = useReducer(dataReducer, {
        condition: initCondition,
        lastEventId: 0,
    });

    const startPayment = useCallback((startPaymentPayload: StartPaymentPayload) => {
        (async () => {
            dispatch({ type: 'SET_CONDITION', payload: { name: 'pending' } });
            const modelInvoice = await determineModel(model);
            dispatch({ type: 'SET_MODEL_INVOICE', payload: modelInvoice });
            await createPayment(modelInvoice, startPaymentPayload);
            const {
                apiEndpoint,
                invoiceParams: { invoiceID, invoiceAccessToken },
            } = modelInvoice;
            const pollingResult = await pollInvoiceEvents({
                apiEndpoint,
                invoiceAccessToken,
                invoiceID,
                stopPollingTypes: [
                    InvoiceChangeType.InvoiceStatusChanged,
                    InvoiceChangeType.PaymentStatusChanged,
                    InvoiceChangeType.PaymentInteractionRequested,
                ],
                delays: {
                    pollingTimeout: DEFAULT_TIMEOUT_MS,
                    apiMethodCall: API_METHOD_CALL_MS,
                },
            });
            const { eventId, condition } = applyPollingResult(pollingResult);
            dispatch({ type: 'SET_LAST_EVENT_ID', payload: eventId });
            dispatch({ type: 'SET_CONDITION', payload: condition });
        })();
    }, []);

    const continuePayment = useCallback(() => {
        async () => {
            dispatch({ type: 'SET_CONDITION', payload: { name: 'pending' } });
            if (isNil(state.modelInvoice)) {
                throw new Error('Model invoice should be defined');
            }
            const {
                apiEndpoint,
                invoiceParams: { invoiceID, invoiceAccessToken },
            } = state.modelInvoice;
            const pollingResult = await pollInvoiceEvents({
                apiEndpoint,
                invoiceAccessToken,
                invoiceID,
                stopPollingTypes: [InvoiceChangeType.InvoiceStatusChanged, InvoiceChangeType.PaymentStatusChanged],
                delays: {
                    pollingTimeout: DEFAULT_TIMEOUT_MS,
                    apiMethodCall: API_METHOD_CALL_MS,
                },
            });
            const { eventId, condition } = applyPollingResult(pollingResult);
            dispatch({ type: 'SET_LAST_EVENT_ID', payload: eventId });
            dispatch({ type: 'SET_CONDITION', payload: condition });
        };
    }, []);

    return { paymentCondition: state.condition, startPayment, continuePayment };
};
