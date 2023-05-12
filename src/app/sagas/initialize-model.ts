import { InvoiceCreated, TypeKeys } from 'checkout/actions';
import { put, takeLatest } from 'redux-saga/effects';

export function* initializeModel({ payload }: InvoiceCreated) {
    yield put({ type: TypeKeys.INVOICE_CREATED, payload });
}

export function* watchInitializeModel() {
    yield takeLatest(TypeKeys.INITIALIZE_MODEL_REQUESTED, initializeModel);
}
