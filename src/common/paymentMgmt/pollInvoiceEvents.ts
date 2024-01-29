import { InvoiceChange, InvoiceChangeType, InvoiceEvent, getInvoiceEvents } from 'checkout/backend';

import { delay, isNil, last } from '../utils';

const GET_INVOICE_EVENTS_LIMIT = 20;

const getChange = (
    event: InvoiceEvent | undefined,
    stopPollingChangeTypes: InvoiceChangeType[],
): InvoiceChange | undefined => {
    if (isNil(event) || isNil(event.changes)) {
        return undefined;
    }
    const change = last(event.changes);
    if (isNil(change)) {
        return undefined;
    }
    if (stopPollingChangeTypes.includes(change.changeType)) {
        return change;
    }
};

const fetchEvents = async (params: PollInvoiceEventsParams, isStop: () => boolean): Promise<PollingResult> => {
    const { apiEndpoint, invoiceAccessToken, invoiceID, eventID, stopPollingTypes, delays } = params;
    const events = await getInvoiceEvents(
        apiEndpoint,
        invoiceAccessToken,
        invoiceID,
        GET_INVOICE_EVENTS_LIMIT,
        eventID,
    );
    const lastEvent = last(events);
    const change = getChange(lastEvent, stopPollingTypes);
    if (!isNil(change)) {
        return {
            status: 'POLLED',
            eventID: lastEvent.id,
            change,
        };
    }
    if (isStop()) {
        return Promise.resolve(null);
    }
    await delay(delays.apiMethodCall);
    return await fetchEvents({ ...params, eventID: isNil(lastEvent) ? eventID : lastEvent.id }, isStop);
};

export type PollInvoiceEventsParams = {
    apiEndpoint: string;
    invoiceAccessToken: string;
    invoiceID: string;
    eventID?: number;
    stopPollingTypes: InvoiceChangeType[];
    delays: {
        pollingTimeout: number;
        apiMethodCall: number;
    };
};

export type PollingResultPolled = {
    status: 'POLLED';
    eventID: number;
    change: InvoiceChange;
};

export type PollingResultTimeout = {
    status: 'TIMEOUT';
};

export type PollingResult = PollingResultPolled | PollingResultTimeout;

export const pollInvoiceEvents = async (params: PollInvoiceEventsParams): Promise<PollingResult> => {
    let stopPolling = false;
    const result = await Promise.race([fetchEvents(params, () => stopPolling), delay(params.delays.pollingTimeout)]);
    if (isNil(result)) {
        stopPolling = true;
        return {
            status: 'TIMEOUT',
        };
    }
    return result;
};
