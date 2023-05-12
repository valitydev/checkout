import { SetEventsAction, TypeKeys } from 'checkout/actions';
import { put, takeLatest } from 'redux-saga/effects';

export function* initializeEvents({ payload }: SetEventsAction) {
    yield put({ type: TypeKeys.EVENTS_INIT, payload } as SetEventsAction);
}

export function* watchInitializeEvents() {
    yield takeLatest(TypeKeys.EVENTS_INIT_REQUESTED, initializeEvents);
}
