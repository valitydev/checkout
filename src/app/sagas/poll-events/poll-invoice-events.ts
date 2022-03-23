import last from 'lodash-es/last';
import { call, put, race, select, delay } from 'redux-saga/effects';
import { InvoiceEvent, getInvoiceEvents, InvoiceChangeType, InteractionType } from 'checkout/backend';
import { SetEventsAction, TypeKeys } from 'checkout/actions';
import { State } from 'checkout/state';
import { provideFromInvoiceEvent } from '../provide-modal';
import get from 'lodash-es/get';

const isStop = (event: InvoiceEvent): boolean => {
    if (!event || !event.changes) {
        return false;
    }
    const change = last(event.changes);
    if (!change) {
        return false;
    }
    switch (change.changeType) {
        case InvoiceChangeType.InvoiceStatusChanged:
        case InvoiceChangeType.PaymentStatusChanged:
        case InvoiceChangeType.PaymentInteractionRequested:
            return true;
        default:
            return false;
    }
};

function* getLastEventID() {
    return yield select(({ events: { events: events } }: State) => (events && events.length > 0 ? last(events).id : 0));
}

function* poll(endpoint: string, token: string, invoiceID: string, interval = 1000) {
    let lastEventID = yield call(getLastEventID);
    let lastEvent = null;
    let events = [];
    while (!isStop(lastEvent)) {
        yield delay(interval);
        let chunk: InvoiceEvent[] = [];
        try {
            chunk = yield call(getInvoiceEvents, endpoint, token, invoiceID, 5, lastEventID);
        } catch (e) {
            console.error(e);
        }
        yield put({
            type: TypeKeys.EVENTS_POLLING,
            payload: chunk
        } as SetEventsAction);
        lastEvent = last(chunk);
        lastEventID = lastEvent ? lastEvent.id : lastEventID;
        events = yield select((state: State) => state.events);
    }
    return [lastEvent, events];
}

function isEventToWait(event: InvoiceEvent): boolean {
    return (
        event &&
        get(last(event.changes), ['userInteraction', 'interactionType']) === InteractionType.QrCodeDisplayRequest
    );
}

const POLLING_TIME_MS = 60 * 1000;
const POLLING_INTEVAL_MS = 1000;
const EVENTS_WAIT_POLLING_TIME_MS = 10 * 60 * 1000;
const EVENTS_WAIT_INTERVAL_MS = 5 * 1000;

export function* pollInvoiceEvents(endpoint: string, token: string, invoiceID: string) {
    let lastEvent: InvoiceEvent;
    let events: InvoiceEvent[];
    for (let i = 1; !lastEvent && i < 6; i += 1) {
        [[lastEvent, events]] = yield race<any>([
            call(poll, endpoint, token, invoiceID),
            delay(POLLING_TIME_MS * i, POLLING_INTEVAL_MS * 2 ** i)
        ]);
    }
    if (isEventToWait(lastEvent)) {
        yield call(provideFromInvoiceEvent, events);
        [lastEvent] = yield race([
            call(poll, endpoint, token, invoiceID, EVENTS_WAIT_INTERVAL_MS),
            delay(EVENTS_WAIT_POLLING_TIME_MS)
        ]);
    }
    if (lastEvent) {
        return yield put({
            type: TypeKeys.EVENTS_POLLED
        } as SetEventsAction);
    }
    return yield put({
        type: TypeKeys.EVENTS_POLLING_TIMEOUT
    } as SetEventsAction);
}
