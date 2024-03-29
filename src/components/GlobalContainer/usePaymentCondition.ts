import { useReducer } from 'react';

import { getLastEventId } from './utils';
import { InvoiceChangeType } from '../../common/backend/payments';
import { InvoiceDetermined, PaymentCondition, pollingResultToConditions } from '../../common/paymentCondition';
import {
    PollInvoiceEventsDelay,
    StartPaymentPayload,
    createPayment,
    determineModel,
    pollInvoiceEvents,
} from '../../common/paymentMgmt';
import { CommonPaymentModel, InvoiceContext, PaymentModel } from '../../common/paymentModel';
import { extractError, isNil } from '../../common/utils';

type Action =
    | { type: 'COMBINE_CONDITIONS'; payload: PaymentCondition[] }
    | { type: 'SET_INVOICE_DETERMINED'; payload: PaymentCondition };

const dataReducer = (conditions: PaymentCondition[], action: Action): PaymentCondition[] => {
    switch (action.type) {
        case 'COMBINE_CONDITIONS':
            return conditions.concat(action.payload);
        case 'SET_INVOICE_DETERMINED':
            return [action.payload, ...conditions];
        default:
            return conditions;
    }
};

export const usePaymentCondition = (model: PaymentModel, initConditions: PaymentCondition[]) => {
    const [conditions, dispatch] = useReducer(dataReducer, initConditions);

    const startPayment = (startPaymentPayload: StartPaymentPayload) => {
        (async () => {
            try {
                dispatch({ type: 'COMBINE_CONDITIONS', payload: [{ name: 'paymentProcessStarted' }] });
                const { invoiceContext } = await determineInvoice();
                await createPayment(model, invoiceContext, startPaymentPayload);
                await startPolling(model, invoiceContext, ['PaymentStatusChanged', 'PaymentInteractionRequested'], {
                    pollingTimeout: 60 * 1000 * 3,
                    apiMethodCall: 1000,
                });
            } catch (exception) {
                console.error(`startPayment error: ${extractError(exception)}`);
                dispatch({
                    type: 'COMBINE_CONDITIONS',
                    payload: [
                        {
                            name: 'paymentProcessFailed',
                            exception,
                        },
                    ],
                });
            }
        })();
    };

    const startWaitingPaymentResult = () => {
        (async () => {
            try {
                const { invoiceContext } = await determineInvoice();
                await startPolling(model, invoiceContext, ['PaymentStatusChanged'], {
                    pollingTimeout: 60 * 1000 * 20,
                    apiMethodCall: 3000,
                });
            } catch (exception) {
                console.error(`startWaitingPaymentResult error: ${extractError(exception)}`);
                dispatch({
                    type: 'COMBINE_CONDITIONS',
                    payload: [
                        {
                            name: 'paymentProcessFailed',
                            exception,
                        },
                    ],
                });
            }
        })();
    };

    const determineInvoice = async (): Promise<InvoiceDetermined> => {
        let invoiceDetermined = conditions.find((c) => c.name === 'invoiceDetermined') as InvoiceDetermined;
        if (!isNil(invoiceDetermined)) {
            return invoiceDetermined;
        }
        const invoiceContext = await determineModel(model);
        invoiceDetermined = { name: 'invoiceDetermined', invoiceContext };
        dispatch({ type: 'SET_INVOICE_DETERMINED', payload: invoiceDetermined });
        return invoiceDetermined;
    };

    const startPolling = async (
        { apiEndpoint }: CommonPaymentModel,
        invoiceContext: InvoiceContext,
        stopPollingTypes: InvoiceChangeType[],
        delays: PollInvoiceEventsDelay,
    ) => {
        const {
            invoiceParams: { invoiceID, invoiceAccessToken },
        } = invoiceContext;
        const lastEventId = getLastEventId(conditions);
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

    return { conditions, startPayment, startWaitingPaymentResult };
};
