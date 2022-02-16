import { call, CallEffect } from 'redux-saga/effects';
import { AmountInfoState, ModelState, OnlineBankingAccountFormValues } from 'checkout/state';
import { Config } from 'checkout/config';
import { makePayment } from './make-payment';
import { createOnlineBanking } from '../../create-payment-resource';

const createPaymentResource = (endpoint: string, provider: string, metadata: any) =>
    createOnlineBanking.bind(null, endpoint, provider, metadata);

export function* payWithOnlineBanking(
    c: Config,
    m: ModelState,
    a: AmountInfoState,
    v: OnlineBankingAccountFormValues
): Iterator<CallEffect> {
    const fn = createPaymentResource(c.appConfig.capiEndpoint, v.provider, v.metadata);
    yield call(makePayment, c, m, v, a, fn);
}
