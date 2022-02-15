import { call, CallEffect } from 'redux-saga/effects';
import { AmountInfoState, ModelState, WalletFormValues } from 'checkout/state';
import { Config } from 'checkout/config';
import { createDigitalWallet } from '../../create-payment-resource';
import { makePayment } from './make-payment';

export const createPaymentResource = (endpoint: string, formValues: WalletFormValues) =>
    createDigitalWallet.bind(null, endpoint, formValues);

export function* payWithDigitalWallet(
    c: Config,
    m: ModelState,
    a: AmountInfoState,
    v: WalletFormValues
): Iterator<CallEffect> {
    const fn = createPaymentResource(c.appConfig.capiEndpoint, v);
    yield call(makePayment, c, m, v, a, fn);
}
