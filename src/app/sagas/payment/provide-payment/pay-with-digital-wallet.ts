import { call, CallEffect } from 'redux-saga/effects';
import { WalletFormValues } from 'checkout/state';
import { createDigitalWallet } from '../../create-payment-resource';
import { makePayment } from './make-payment';
import { AppContext } from 'checkout/actions';

export const createPaymentResource = (endpoint: string, formValues: WalletFormValues) =>
    createDigitalWallet.bind(null, endpoint, formValues);

export function* payWithDigitalWallet(context: AppContext, v: WalletFormValues): Iterator<CallEffect> {
    const fn = createPaymentResource(context.appConfig.capiEndpoint, v);
    yield call(makePayment, context, v, fn);
}
