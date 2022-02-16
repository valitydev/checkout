import { call, CallEffect, put, PutEffect, select, SelectEffect } from 'redux-saga/effects';
import { PaymentMethod } from 'checkout/backend';
import { Config } from 'checkout/config';
import { InitializeAvailablePaymentMethodsCompleted, TypeKeys } from 'checkout/actions';
import { PaymentMethod as PaymentMethodState, State, AmountInfoState } from 'checkout/state';
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
    amountInfo: AmountInfoState
): Iterator<InitializeEffect> {
    const methods = yield call(toAvailablePaymentMethods, paymentMethods, config, amountInfo);
    const prioritizedMethods = yield call(setPriority, methods);
    yield put({
        type: TypeKeys.INITIALIZE_AVAILABLE_PAYMENT_METHODS_COMPLETED,
        payload: prioritizedMethods
    } as InitializeAvailablePaymentMethodsCompleted);
    return yield select((state: State) => state.availablePaymentMethods);
}
