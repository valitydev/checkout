import { InvoiceChangeType, InvoiceEvent, getInvoiceEvents } from 'checkout/backend';

import { delay, isNil, last } from '../utils';

const GET_INVOICE_EVENTS_LIMIT = 20;

const isChangeFound = (event: InvoiceEvent | undefined, stopPollingTypes: InvoiceChangeType[]): boolean => {
    if (isNil(event) || isNil(event.changes)) {
        return false;
    }
    return event.changes.reduce((result, { changeType }) => {
        if (result) {
            return result;
        }
        return stopPollingTypes.includes(changeType);
    }, false);
};

const fetchEvents = async (params: PollInvoiceEventsParams, isStop: () => boolean): Promise<PollingResult> => {
    const { apiEndpoint, invoiceAccessToken, invoiceID, startFromEventID, stopPollingTypes, delays } = params;
    const events = await getInvoiceEvents(
        apiEndpoint,
        invoiceAccessToken,
        invoiceID,
        GET_INVOICE_EVENTS_LIMIT,
        startFromEventID,
    );
    const lastEvent = last(events);
    if (isChangeFound(lastEvent, stopPollingTypes)) {
        return {
            status: 'POLLED',
            events,
        };
    }
    if (isStop()) {
        return Promise.resolve(null);
    }
    await delay(delays.apiMethodCall);
    return await fetchEvents({ ...params, startFromEventID }, isStop);
};

export type PollInvoiceEventsDelay = {
    pollingTimeout: number;
    apiMethodCall: number;
};

export type PollInvoiceEventsParams = {
    apiEndpoint: string;
    invoiceAccessToken: string;
    invoiceID: string;
    startFromEventID?: number;
    stopPollingTypes: InvoiceChangeType[];
    delays: PollInvoiceEventsDelay;
};

export type PollingResultPolled = {
    status: 'POLLED';
    events: InvoiceEvent[];
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
