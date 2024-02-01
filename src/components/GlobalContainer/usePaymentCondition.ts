import { useCallback, useReducer } from 'react';

import { InvoiceChangeType } from 'checkout/backend';

import { PaymentCondition, pollingResultToConditions } from '../../common/paymentCondition';
import { StartPaymentPayload, createPayment, determineModel, pollInvoiceEvents } from '../../common/paymentMgmt';
import { PaymentModel, PaymentModelInvoice } from '../../common/paymentModel';
import { last, isNil } from '../../common/utils';

type State = {
    conditions: PaymentCondition[];
    modelInvoice?: PaymentModelInvoice;
};

type Action =
    | { type: 'COMBINE_CONDITIONS'; payload: PaymentCondition[] }
    | { type: 'SET_MODEL_INVOICE'; payload: PaymentModelInvoice };

const dataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'COMBINE_CONDITIONS':
            return {
                ...state,
                conditions: state.conditions.concat(action.payload),
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

const getLastEventId = (conditions: PaymentCondition[]): number => {
    const lastCondition = last(conditions);
    if (isNil(lastCondition)) return 0;
    // 'eventId' is not present in every condition object type.
    return isNil((lastCondition as any).eventId) && 0;
};

export const usePaymentCondition = (model: PaymentModel, initConditions: PaymentCondition[]) => {
    const [state, dispatch] = useReducer(dataReducer, {
        conditions: initConditions,
    });

    const startPayment = useCallback((startPaymentPayload: StartPaymentPayload) => {
        (async () => {
            const conditions = state.conditions;
            try {
                dispatch({ type: 'COMBINE_CONDITIONS', payload: [{ name: 'paymentProcessStarted' }] });
                const modelInvoice = await determineModel(model);
                dispatch({ type: 'SET_MODEL_INVOICE', payload: modelInvoice });
                await createPayment(modelInvoice, startPaymentPayload);
                const {
                    apiEndpoint,
                    invoiceParams: { invoiceID, invoiceAccessToken },
                } = modelInvoice;
                const lastEventId = getLastEventId(conditions);
                const DEFAULT_TIMEOUT_MS = 60 * 1000 * 3;
                const API_METHOD_CALL_MS = 1000;
                const pollingResult = await pollInvoiceEvents({
                    apiEndpoint,
                    invoiceAccessToken,
                    invoiceID,
                    startFromEventID: lastEventId,
                    stopPollingTypes: [
                        InvoiceChangeType.PaymentStatusChanged,
                        InvoiceChangeType.PaymentInteractionRequested,
                    ],
                    delays: {
                        pollingTimeout: DEFAULT_TIMEOUT_MS,
                        apiMethodCall: API_METHOD_CALL_MS,
                    },
                });
                dispatch({ type: 'COMBINE_CONDITIONS', payload: pollingResultToConditions(pollingResult) });
            } catch (ex) {
                console.error(ex);
                dispatch({
                    type: 'COMBINE_CONDITIONS',
                    payload: [
                        {
                            name: 'paymentProcessFailed',
                            exception: {
                                type: 'ApiCallException',
                            },
                        },
                    ],
                });
            }
        })();
    }, []);

    const continuePayment = useCallback(() => {}, []);

    return { conditions: state.conditions, startPayment, continuePayment };
};
