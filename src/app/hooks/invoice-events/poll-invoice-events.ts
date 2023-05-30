import { InvoiceChange, InvoiceChangeType, InvoiceEvent, getInvoiceEvents } from 'checkout/backend';
import isNil from 'checkout/utils/is-nil';
import last from 'checkout/utils/last';

const GET_INVOICE_EVENTS_LIMIT = 5;

const delay = (ms: number): Promise<undefined> => new Promise((resolve) => setTimeout(resolve, ms));

const getChange = (
    event: InvoiceEvent | undefined,
    stopPollingChangeTypes: InvoiceChangeType[]
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
    const { capiEndpoint, invoiceAccessToken, invoiceID, eventID, stopPollingTypes, delays } = params;
    await delay(delays.apiMethodCall);
    const events = await getInvoiceEvents(
        capiEndpoint,
        invoiceAccessToken,
        invoiceID,
        GET_INVOICE_EVENTS_LIMIT,
        eventID
    );
    const lastEvent = last(events);
    const change = getChange(lastEvent, stopPollingTypes);
    if (!isNil(change)) {
        return {
            status: 'POLLED',
            eventID: lastEvent.id,
            change
        };
    }
    if (isStop()) {
        return Promise.resolve(null);
    }
    return await fetchEvents({ ...params, eventID: isNil(lastEvent) ? eventID : lastEvent.id }, isStop);
};

export type PollInvoiceEventsParams = {
    capiEndpoint: string;
    invoiceAccessToken: string;
    invoiceID: string;
    eventID?: number;
    stopPollingTypes: InvoiceChangeType[];
    delays: {
        pollingTimeout: number;
        apiMethodCall: number;
    };
};

export type PollingResult =
    | {
          status: 'POLLED';
          eventID: number;
          change: InvoiceChange;
      }
    | {
          status: 'TIMEOUT';
      };

export const pollInvoiceEvents = async (params: PollInvoiceEventsParams): Promise<PollingResult> => {
    let stopPolling = false;
    const result = await Promise.race([fetchEvents(params, () => stopPolling), delay(params.delays.pollingTimeout)]);
    if (isNil(result)) {
        stopPolling = true;
        return {
            status: 'TIMEOUT'
        };
    }
    return result;
};
