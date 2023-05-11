import { call, ForkEffect, put, select, takeLatest } from 'redux-saga/effects';
import { FinishInteractionRequested, goToFormInfo, TypeKeys } from 'checkout/actions';
import { ResultFormInfo, ResultType, State, EventsStatus } from 'checkout/state';
import { pollInvoiceEvents } from '../poll-events';
import { provideFromInvoiceEvent } from '../provide-modal';
import { ServiceProvider } from 'checkout/backend';

function* finishInvoice(capiEndpoint: string, token: string, invoiceID: string, serviceProviders: ServiceProvider[]) {
    yield call(pollInvoiceEvents, capiEndpoint, token, invoiceID);
    const { status, events } = yield select((state: State) => state.events);
    switch (status) {
        case EventsStatus.polled:
            yield call(provideFromInvoiceEvent, events, serviceProviders);
            break;
        case EventsStatus.timeout:
            yield put(goToFormInfo(new ResultFormInfo(ResultType.processed)));
            break;
    }
}

export function* finishInteraction({
    payload: { capiEndpoint, invoiceID, invoiceAccessToken, serviceProviders }
}: FinishInteractionRequested): Iterator<any> {
    try {
        yield put({
            type: TypeKeys.SET_MODAL_INTERACTION_POLLING,
            payload: true
        });
        yield call(finishInvoice, capiEndpoint, invoiceAccessToken, invoiceID, serviceProviders);
        yield put({
            type: TypeKeys.SET_MODAL_INTERACTION_POLLING,
            payload: false
        });
        yield put({
            type: TypeKeys.FINISH_INTERACTION_COMPLETED
        });
    } catch (error) {
        yield put({
            type: TypeKeys.FINISH_INTERACTION_FAILED,
            payload: error
        });
    }
}

export function* watchFinishInteraction(): Iterator<ForkEffect> {
    yield takeLatest(TypeKeys.FINISH_INTERACTION_REQUESTED, finishInteraction);
}
