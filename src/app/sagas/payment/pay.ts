import { call, CallEffect, ForkEffect, put, PutEffect, select, SelectEffect, takeLatest } from 'redux-saga/effects';
import { goToFormInfo, PaymentCompleted, PaymentFailed, PaymentRequested, TypeKeys } from 'checkout/actions';
import { Event, ServiceProvider } from 'checkout/backend';
import { EventsStatus, ResultFormInfo, ResultType, State } from 'checkout/state';
import { provideFromInvoiceEvent } from '../provide-modal';
import { pollInvoiceEvents } from '../poll-events';

export function* paymentComplete(
    events: Event[],
    serviceProviders: ServiceProvider[]
): Iterator<SelectEffect | CallEffect | PutEffect<PaymentCompleted>> {
    yield call(provideFromInvoiceEvent, events, serviceProviders);
    yield put({ type: TypeKeys.PAYMENT_COMPLETED } as PaymentCompleted);
}

export function* pay(action: PaymentRequested) {
    try {
        const { capiEndpoint, invoiceAccessToken, invoiceID, serviceProviders } = action.payload;
        yield call(pollInvoiceEvents, capiEndpoint, invoiceAccessToken, invoiceID);
        const { events, status } = yield select((state: State) => state.events);
        switch (status) {
            case EventsStatus.polled:
                yield call(paymentComplete, events, serviceProviders);
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
