import { useCallback, useEffect, useReducer, useState } from 'react';

import { InvoiceChange, InvoiceChangeType, ResponseError, getInvoiceEvents } from 'checkout/backend';
import { findChange } from 'checkout/utils/event-utils';
import isNil from 'checkout/utils/is-nil';

import { PayableInvoiceData } from './create-payment';
import { PollingResult, pollInvoiceEvents } from './invoice-events';

const API_METHOD_CALL_MS = 1000;
const DEFAULT_TIMEOUT_MS = 60 * 1000 * 10;
const PAYMENT_STARTED_TIMEOUT_MS = 60 * 1000;

type State =
    | { status: 'PRISTINE' }
    | { status: 'POLLING_TIMEOUT' }
    | { status: 'POLLING_SUCCESS'; payload: InvoiceChange }
    | { status: 'EVENT_CHANGE_FOUND'; payload: InvoiceChange }
    | { status: 'FAILURE'; error: ResponseError | Error };

type Action =
    | { type: 'SET_FAILURE'; error: ResponseError | Error }
    | { type: 'POLL_EVENTS_TIMEOUT' }
    | { type: 'SET_POLLING_RESULT'; payload: InvoiceChange }
    | { type: 'SET_SEARCH_RESULT'; payload: InvoiceChange };

const dataReducer = (_state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_FAILURE':
            return {
                status: 'FAILURE',
                error: action.error,
            };
        case 'POLL_EVENTS_TIMEOUT':
            return {
                status: 'POLLING_TIMEOUT',
            };
        case 'SET_POLLING_RESULT':
            return {
                status: 'POLLING_SUCCESS',
                payload: action.payload,
            };
        case 'SET_SEARCH_RESULT':
            return {
                status: 'EVENT_CHANGE_FOUND',
                payload: action.payload,
            };
    }
};

export const useInvoiceEvents = (capiEndpoint: string, data: PayableInvoiceData) => {
    const [eventsState, dispatch] = useReducer(dataReducer, {
        status: 'PRISTINE',
    });
    const [pollingResult, setPollingResult] = useState<PollingResult>(null);

    const startPolling = useCallback(
        (eventID?: number, pollingTimeout = DEFAULT_TIMEOUT_MS) => {
            const { invoice, invoiceAccessToken } = data;
            const fetchData = async () => {
                try {
                    const pollingResult = await pollInvoiceEvents({
                        capiEndpoint,
                        invoiceAccessToken,
                        invoiceID: invoice.id,
                        stopPollingTypes: [
                            InvoiceChangeType.InvoiceCreated,
                            InvoiceChangeType.PaymentStarted,
                            InvoiceChangeType.InvoiceStatusChanged,
                            InvoiceChangeType.PaymentStatusChanged,
                            InvoiceChangeType.PaymentInteractionRequested,
                        ],
                        delays: {
                            pollingTimeout,
                            apiMethodCall: API_METHOD_CALL_MS,
                        },
                        eventID,
                    });
                    setPollingResult(pollingResult);
                } catch (error) {
                    dispatch({ type: 'SET_FAILURE', error });
                    console.error('Polling invoice events failure', error);
                }
            };
            fetchData();
        },
        [capiEndpoint, data],
    );

    useEffect(() => {
        if (isNil(pollingResult)) return;
        switch (pollingResult.status) {
            case 'TIMEOUT':
                dispatch({ type: 'POLL_EVENTS_TIMEOUT' });
                break;
            case 'POLLED':
                const change = pollingResult.change;
                if (change.changeType === InvoiceChangeType.PaymentStarted) {
                    startPolling(pollingResult.eventID, PAYMENT_STARTED_TIMEOUT_MS);
                } else {
                    startPolling(pollingResult.eventID);
                    dispatch({
                        type: 'SET_POLLING_RESULT',
                        payload: pollingResult.change,
                    });
                }
                break;
        }
    }, [pollingResult, startPolling]);

    const searchEventsChange = useCallback(
        (foundType: string) => {
            const fetchData = async () => {
                try {
                    const { invoice, invoiceAccessToken } = data;
                    const events = await getInvoiceEvents(capiEndpoint, invoiceAccessToken, invoice.id);
                    const found = findChange<InvoiceChange>(events, foundType);
                    if (found) {
                        dispatch({ type: 'SET_SEARCH_RESULT', payload: found });
                    } else {
                        dispatch({
                            type: 'SET_FAILURE',
                            error: new Error(`Event change: "${foundType}" is not found`),
                        });
                    }
                } catch (error) {
                    dispatch({ type: 'SET_FAILURE', error });
                    console.error('Find events change failure', error);
                }
            };
            fetchData();
        },
        [capiEndpoint, data],
    );

    return { eventsState, startPolling, searchEventsChange };
};
