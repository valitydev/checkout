import { call, CallEffect, put, PutEffect, select, SelectEffect } from 'redux-saga/effects';
import { PaymentMethod, ServiceProvider } from 'checkout/backend';
import { Config } from 'checkout/config';
import { InitializeAvailablePaymentMethodsCompleted, TypeKeys } from 'checkout/actions';
import { PaymentMethod as PaymentMethodState, State } from 'checkout/state';
import { setPriority } from './set-priority';
import { toAvailablePaymentMethods } from './to-available-payment-methods';

export type InitializeEffect =
    | CallEffect
    | PutEffect<InitializeAvailablePaymentMethodsCompleted>
    | SelectEffect
    | PaymentMethodState;

export function* initializeAvailablePaymentMethods(
    config: Config,
    paymentMethods: PaymentMethod[],
    serviceProviders: ServiceProvider[]
): Iterator<InitializeEffect> {
    const methods = yield call(toAvailablePaymentMethods, paymentMethods, config, serviceProviders);
    const prioritizedMethods = yield call(setPriority, methods);
    yield put({
        type: TypeKeys.INITIALIZE_AVAILABLE_PAYMENT_METHODS_COMPLETED,
        payload: prioritizedMethods
    } as InitializeAvailablePaymentMethodsCompleted);
    return yield select((state: State) => state.availablePaymentMethods);
}
