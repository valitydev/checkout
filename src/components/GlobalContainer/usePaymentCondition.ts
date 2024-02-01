import { useCallback, useReducer } from 'react';

import { InvoiceChangeType } from 'checkout/backend';

import { getLastEventId } from './utils';
import { PaymentCondition, pollingResultToConditions } from '../../common/paymentCondition';
import {
    PollInvoiceEventsDelay,
    StartPaymentPayload,
    createPayment,
    determineModel,
    pollInvoiceEvents,
} from '../../common/paymentMgmt';
import { PaymentModel, PaymentModelInvoice } from '../../common/paymentModel';
import { isNil } from '../../common/utils';

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

export const usePaymentCondition = (model: PaymentModel, initConditions: PaymentCondition[]) => {
    const [state, dispatch] = useReducer(dataReducer, {
        conditions: initConditions,
    });

    const startPayment = useCallback(
        (startPaymentPayload: StartPaymentPayload) => {
            (async () => {
                try {
                    dispatch({ type: 'COMBINE_CONDITIONS', payload: [{ name: 'paymentProcessStarted' }] });
                    const modelInvoice = await getModelInvoice();
                    await createPayment(modelInvoice, startPaymentPayload);
                    await startPolling(
                        modelInvoice,
                        [InvoiceChangeType.PaymentStatusChanged, InvoiceChangeType.PaymentInteractionRequested],
                        {
                            pollingTimeout: 60 * 1000 * 3,
                            apiMethodCall: 1000,
                        },
                    );
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
        },
        [model, state],
    );

    const startWaitingPaymentResult = useCallback(() => {
        (async () => {
            try {
                const modelInvoice = await getModelInvoice();
                await startPolling(modelInvoice, [InvoiceChangeType.PaymentStatusChanged], {
                    pollingTimeout: 60 * 1000 * 25,
                    apiMethodCall: 3000,
                });
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
    }, [model, state]);

    const getModelInvoice = async () => {
        if (isNil(state.modelInvoice)) {
            const modelInvoice = await determineModel(model);
            dispatch({ type: 'SET_MODEL_INVOICE', payload: modelInvoice });
            return modelInvoice;
        }
        return state.modelInvoice;
    };

    const startPolling = async (
        modelInvoice: PaymentModelInvoice,
        stopPollingTypes: InvoiceChangeType[],
        delays: PollInvoiceEventsDelay,
    ) => {
        const {
            apiEndpoint,
            invoiceParams: { invoiceID, invoiceAccessToken },
        } = modelInvoice;
        const lastEventId = getLastEventId(state.conditions);
        const pollingResult = await pollInvoiceEvents({
            apiEndpoint,
            invoiceAccessToken,
            invoiceID,
            startFromEventID: lastEventId,
            stopPollingTypes,
            delays,
        });
        dispatch({ type: 'COMBINE_CONDITIONS', payload: pollingResultToConditions(pollingResult) });
    };

    return { conditions: state.conditions, startPayment, startWaitingPaymentResult };
};
