import { InvoiceChange, InvoiceChangeType, InvoiceEvent, getInvoiceEvents } from 'checkout/backend';
import isNil from 'checkout/utils/is-nil';

const GET_INVOICE_EVENTS_LIMIT = 5;
const GET_INVOICE_EVENTS_CALL_DELAY_MS = 1000;

const delay = (ms: number): Promise<undefined> => new Promise((resolve) => setTimeout(() => resolve(undefined), ms));

const last = <T>(array: T[]): T | undefined => array[array.length - 1];

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

const getInvoiceEventsWithDelay = async (
    { capiEndpoint, invoiceAccessToken, invoiceID }: GetInvoiceEventsParams,
    eventID?: number
) => {
    await delay(GET_INVOICE_EVENTS_CALL_DELAY_MS);
    return getInvoiceEvents(capiEndpoint, invoiceAccessToken, invoiceID, GET_INVOICE_EVENTS_LIMIT, eventID);
};

const fetchEvents = async (
    params: GetInvoiceEventsParams,
    stopPollingTypes: InvoiceChangeType[],
    eventID?: number
): Promise<PollingSuccess> => {
    const events = await getInvoiceEventsWithDelay(params, eventID);
    const lastEvent = last(events);
    const change = getChange(lastEvent, stopPollingTypes);
    if (!isNil(change)) {
        return {
            status: 'POLLED',
            eventID: lastEvent.id,
            change
        };
    }
    const nextFetchEventID = isNil(lastEvent) ? eventID : lastEvent.id;
    return await fetchEvents(params, stopPollingTypes, nextFetchEventID);
};

export type GetInvoiceEventsParams = {
    capiEndpoint: string;
    invoiceAccessToken: string;
    invoiceID: string;
};

export type PollingContext = {
    stopPollingTypes: InvoiceChangeType[];
    pollingTimeoutMs: number;
    eventID?: number;
};

type PollingSuccess = {
    status: 'POLLED';
    eventID: number;
    change: InvoiceChange;
};
type PollingTimeout = {
    status: 'TIMEOUT';
};
export type PollingResult = PollingSuccess | PollingTimeout;

export const pollInvoiceEvents = async (
    params: GetInvoiceEventsParams,
    context: PollingContext
): Promise<PollingResult> => {
    const result = await Promise.race([
        fetchEvents(params, context.stopPollingTypes, context.eventID),
        delay(context.pollingTimeoutMs)
    ]);
    return isNil(result)
        ? {
              status: 'TIMEOUT'
          }
        : result;
};
