import { useCallback, useEffect, useReducer, useState } from 'react';
import isNil from 'checkout/utils/is-nil';

import { PayableInvoiceData } from './create-payment';
import { PollingResult, pollInvoiceEvents } from './invoice-events';

import {
    Event,
    InvoiceChange,
    InvoiceChangeType,
    InvoiceStatusChanged,
    PaymentInteractionRequested,
    PaymentStatusChanged,
    getInvoiceEvents
} from 'checkout/backend';

const API_METHOD_CALL_MS = 1000;
const POLLING_TIMEOUT_MS = 60 * 1000;
const POLLING_TIMEOUT_STATUS_CHANGED_MS = POLLING_TIMEOUT_MS * 10;

type PolledChangeTypes = PaymentInteractionRequested | InvoiceStatusChanged | PaymentStatusChanged;
type PolledChangeTypesTemp = { change: PolledChangeTypes } & { events: Event[] };

type State =
    | { status: 'PRISTINE' }
    | { status: 'TIMEOUT' }
    | { status: 'SUCCESS'; payload: PolledChangeTypesTemp }
    | { status: 'FAILURE'; error: unknown };

type Action =
    | { type: 'POLL_EVENTS_FAILURE'; error: unknown }
    | { type: 'POLL_EVENTS_TIMEOUT' }
    | { type: 'EVENTS_POLLED'; payload: PolledChangeTypesTemp };

const dataReducer = (_state: State, action: Action): State => {
    switch (action.type) {
        case 'POLL_EVENTS_FAILURE':
            return {
                status: 'FAILURE',
                error: action.error
            };
        case 'POLL_EVENTS_TIMEOUT':
            return {
                status: 'TIMEOUT'
            };
        case 'EVENTS_POLLED':
            return {
                status: 'SUCCESS',
                payload: action.payload
            };
    }
};

const isPolledChangeTypes = (change: InvoiceChange): change is PolledChangeTypes => {
    switch (change.changeType) {
        case InvoiceChangeType.PaymentInteractionRequested:
        case InvoiceChangeType.PaymentStatusChanged:
        case InvoiceChangeType.InvoiceStatusChanged:
            return true;
        default:
            return false;
    }
};

type TempPollingResult = PollingResult & { events: Event[] };

export const useInvoiceEvents = (capiEndpoint: string, data: PayableInvoiceData | null) => {
    const [pollingState, dispatch] = useReducer(dataReducer, {
        status: 'PRISTINE'
    });
    const [pollingResult, setPollingResult] = useState<TempPollingResult>(null);

    const startPolling = useCallback(
        (eventID?: number, pollingTimeout = POLLING_TIMEOUT_MS) => {
            if (isNil(data)) return;
            const { invoice, invoiceAccessToken } = data;
            const fetchData = async () => {
                try {
                    const pollingResult = await pollInvoiceEvents({
                        capiEndpoint,
                        invoiceAccessToken,
                        invoiceID: invoice.id,
                        stopPollingTypes: [
                            InvoiceChangeType.InvoiceStatusChanged,
                            InvoiceChangeType.PaymentStatusChanged,
                            InvoiceChangeType.PaymentInteractionRequested
                        ],
                        delays: {
                            pollingTimeout,
                            apiMethodCall: API_METHOD_CALL_MS
                        },
                        eventID
                    });

                    // Temporary set events for legacy modal state
                    const events = await getInvoiceEvents(capiEndpoint, invoiceAccessToken, invoice.id);

                    setPollingResult({
                        ...pollingResult,
                        events
                    });
                } catch (error) {
                    dispatch({ type: 'POLL_EVENTS_FAILURE', error });
                    console.error('Polling invoice events failure', error);
                }
            };
            fetchData();
        },
        [capiEndpoint, data]
    );

    useEffect(() => {
        if (isNil(pollingResult)) return;
        switch (pollingResult.status) {
            case 'TIMEOUT':
                dispatch({ type: 'POLL_EVENTS_TIMEOUT' });
                break;
            case 'POLLED':
                const change = pollingResult.change;
                if (!isPolledChangeTypes(change)) {
                    dispatch({ type: 'POLL_EVENTS_FAILURE', error: new Error('Wrong polled change type') });
                    return;
                }
                dispatch({ type: 'EVENTS_POLLED', payload: { change, events: pollingResult.events } });
                startPolling(pollingResult.eventID, POLLING_TIMEOUT_STATUS_CHANGED_MS);
                break;
        }
    }, [pollingResult, startPolling]);

    return { pollingState, startPolling };
};
