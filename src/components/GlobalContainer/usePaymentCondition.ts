import { useCallback, useReducer } from 'react';

import { CheckoutServiceProviderMetadata, InvoiceChangeType } from 'checkout/backend';

import { PaymentCondition } from '../../common/paymentCondition';
import {
    StartPaymentPayload,
    createPayment,
    determineModel,
    extractServiceProviderMetadata,
    pollInvoiceEvents,
    pollingResToPaymentCondition,
} from '../../common/paymentMgmt';
import { PaymentModel, PaymentModelInvoice } from '../../common/paymentModel';
import { isNil } from '../../common/utils';

type State = {
    condition: PaymentCondition;
    lastEventId: number;
    modelInvoice?: PaymentModelInvoice;
    metadata?: CheckoutServiceProviderMetadata;
};

type Action =
    | { type: 'SET_CONDITION'; payload: PaymentCondition }
    | { type: 'SET_MODEL_INVOICE'; payload: PaymentModelInvoice }
    | { type: 'SET_LAST_EVENT_ID'; payload: number }
    | { type: 'SET_METADATA'; payload: CheckoutServiceProviderMetadata };

const dataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_CONDITION':
            return {
                ...state,
                condition: action.payload,
            };
        case 'SET_LAST_EVENT_ID':
            return {
                ...state,
                lastEventId: action.payload,
            };
        case 'SET_METADATA':
            return {
                ...state,
                metadata: action.payload,
            };
        case 'SET_MODEL_INVOICE':
            return {
                ...state,
                modelInvoice: action.payload,
            };
        default:
            return state;
    }
};

const API_METHOD_CALL_MS = 1000;
const DEFAULT_TIMEOUT_MS = 60 * 1000 * 20;

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
            const metadata = extractServiceProviderMetadata(modelInvoice.paymentMethods, startPaymentPayload);
            dispatch({ type: 'SET_METADATA', payload: metadata });
            const { eventId, condition } = pollingResToPaymentCondition(pollingResult, metadata);
            dispatch({ type: 'SET_LAST_EVENT_ID', payload: eventId });
            dispatch({ type: 'SET_CONDITION', payload: condition });
        })();
    }, []);

    const continuePayment = useCallback(() => {
        async () => {
            if (isNil(state.modelInvoice)) {
                throw new Error('Model invoice should be defined');
            }
            dispatch({ type: 'SET_CONDITION', payload: { name: 'pending' } });
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
            const { eventId, condition } = pollingResToPaymentCondition(pollingResult, state.metadata);
            dispatch({ type: 'SET_LAST_EVENT_ID', payload: eventId });
            dispatch({ type: 'SET_CONDITION', payload: condition });
        };
    }, []);

    return { paymentCondition: state.condition, startPayment, continuePayment };
};
