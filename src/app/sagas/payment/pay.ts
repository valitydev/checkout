import { call, ForkEffect, put, select, takeLatest } from 'redux-saga/effects';
import { goToFormInfo, PaymentCompleted, PaymentFailed, PaymentRequested, TypeKeys } from 'checkout/actions';
import { EventsStatus, ResultFormInfo, ResultType, State } from 'checkout/state';
import { provideFromInvoiceEvent } from '../provide-modal';

export function* pay(action: PaymentRequested) {
    try {
        const { serviceProviders } = action.payload;
        const { events, status } = yield select((state: State) => state.events);
        switch (status) {
            case EventsStatus.polled:
                yield call(provideFromInvoiceEvent, events, serviceProviders);
                yield put({ type: TypeKeys.PAYMENT_COMPLETED } as PaymentCompleted);
                break;
            case EventsStatus.timeout:
                yield put(goToFormInfo(new ResultFormInfo(ResultType.processed)));
                break;
        }
    } catch (error) {
        yield put({
            type: TypeKeys.PAYMENT_FAILED,
            payload: error
        } as PaymentFailed);
        yield put(goToFormInfo(new ResultFormInfo(ResultType.error)));
    }
}

export function* watchPayment(): Iterator<ForkEffect> {
    yield takeLatest(TypeKeys.PAYMENT_REQUESTED, pay);
}
