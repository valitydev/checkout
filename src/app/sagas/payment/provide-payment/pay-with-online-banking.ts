import { call, CallEffect } from 'redux-saga/effects';
import { AmountInfoState, ModelState, PayableFormValues } from 'checkout/state';
import { Config } from 'checkout/config';
import { makePayment } from './make-payment';
import { createOnlineBanking } from '../../create-payment-resource';
import { ServiceProviderMetadata } from 'checkout/backend';

const createPaymentResource = (endpoint: string, metadata: ServiceProviderMetadata) =>
    createOnlineBanking.bind(null, endpoint, metadata);

export function* payWithOnlineBanking(
    c: Config,
    m: ModelState,
    a: AmountInfoState,
    v: PayableFormValues
): Iterator<CallEffect> {
    const fn = createPaymentResource(c.appConfig.capiEndpoint, (v as any).metadata);
    yield call(makePayment, c, m, v, a, fn);
}
