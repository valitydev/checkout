import { call, CallEffect, ForkEffect, put, PutEffect, select, SelectEffect, takeLatest } from 'redux-saga/effects';
import {
    goToFormInfo,
    PaymentCompleted,
    PaymentFailed,
    PaymentRequested,
    PrepareToPay,
    TypeKeys
} from 'checkout/actions';
import { Event, ServiceProvider } from 'checkout/backend';
import { providePayment } from './provide-payment';
import { EventsStatus, ResultFormInfo, ResultType, State } from 'checkout/state';
import { provideFromInvoiceEvent } from '../provide-modal';

export function* paymentComplete(
    events: Event[],
    serviceProviders: ServiceProvider[]
): Iterator<SelectEffect | CallEffect | PutEffect<PaymentCompleted>> {
    yield call(provideFromInvoiceEvent, events, serviceProviders);
    yield put({ type: TypeKeys.PAYMENT_COMPLETED } as PaymentCompleted);
}

export function* pay(action: PaymentRequested) {
    try {
        const { values, method, context } = action.payload;
        yield put({ type: TypeKeys.PREPARE_TO_PAY } as PrepareToPay);
        yield call(providePayment, method, context, values);
        const { events, status } = yield select((state: State) => state.events);
        switch (status) {
            case EventsStatus.polled:
                yield call(paymentComplete, events, context.model?.serviceProviders);
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
