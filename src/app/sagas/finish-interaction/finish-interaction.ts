import last from 'lodash-es/last';
import { call, CallEffect, ForkEffect, put, select, takeLatest } from 'redux-saga/effects';
import { goToFormInfo, TypeKeys } from 'checkout/actions';
import { ConfigState, ModelState, ResultFormInfo, ResultType, State, EventsStatus } from 'checkout/state';
import { pollInvoiceEvents } from '../poll-events';
import { IntegrationType } from 'checkout/config';
import { provideFromInvoiceEvent } from '../provide-modal';

function* finishInvoice(capiEndpoint: string, token: string, invoiceID: string) {
    yield call(pollInvoiceEvents, capiEndpoint, token, invoiceID);
    const invoiceEventsStatus = yield select((state: State) => state.events.status);
    switch (invoiceEventsStatus) {
        case EventsStatus.polled:
            const event = yield select((state: State) => last(state.events.events));
            yield call(provideFromInvoiceEvent, event);
            break;
        case EventsStatus.timeout:
            yield put(goToFormInfo(new ResultFormInfo(ResultType.processed)));
            break;
    }
}

function* resolve(config: ConfigState, model: ModelState): Iterator<CallEffect> {
    const {
        initConfig,
        appConfig: { capiEndpoint }
    } = config;
    switch (initConfig.integrationType) {
        case IntegrationType.invoice:
        case IntegrationType.invoiceTemplate:
            const {
                invoiceAccessToken,
                invoice: { id }
            } = model;
            return yield call(finishInvoice, capiEndpoint, invoiceAccessToken, id);
    }
}

export function* finishInteraction() {
    try {
        const { config, model } = yield select((s: State) => ({ config: s.config, model: s.model }));
        yield put({
            type: TypeKeys.SET_MODAL_INTERACTION_POLLING,
            payload: true
        });
        yield call(resolve, config, model);
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
