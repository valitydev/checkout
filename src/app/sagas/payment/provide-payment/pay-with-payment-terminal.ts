import { call, CallEffect } from 'redux-saga/effects';
import { AmountInfoState, ModelState, PaymentTerminalFormValues } from 'checkout/state';
import { Config } from 'checkout/config';
import { makePayment } from './make-payment';
import { createPaymentTerminal } from '../../create-payment-resource';

const createPaymentResource = (endpoint: string, provider: string, metadata: any) =>
    createPaymentTerminal.bind(null, endpoint, provider, metadata);

export function* payWithPaymentTerminal(
    c: Config,
    m: ModelState,
    a: AmountInfoState,
    v: PaymentTerminalFormValues
): Iterator<CallEffect> {
    const fn = createPaymentResource(c.appConfig.capiEndpoint, v.provider, v.metadata);
    yield call(makePayment, c, m, v, a, fn, true);
}
