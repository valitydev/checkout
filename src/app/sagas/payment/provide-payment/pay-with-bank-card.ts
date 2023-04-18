import { call, CallEffect } from 'redux-saga/effects';
import { AmountInfoState, CardFormValues, ModelState } from 'checkout/state';
import { Config } from 'checkout/config';
import { createCardData } from '../../create-payment-resource';
import { makePayment } from './make-payment';
import { prepareSelfRedirectUrl } from './prepare-self-redirect-url';
import { shorten } from './shorten';

const createRedirectUrl = ({ initConfig, origin, appConfig }: Config) => (
    invoiceID: string,
    invoiceAccessToken: string,
    invoiceDueDate: string
) =>
    shorten(appConfig.urlShortenerEndpoint, invoiceAccessToken, {
        sourceUrl: prepareSelfRedirectUrl(origin, invoiceID, invoiceAccessToken, initConfig.redirectUrl, false),
        expiresAt: invoiceDueDate
    });

export const createPaymentResource = (endpoint: string, formValues: CardFormValues) =>
    createCardData.bind(null, endpoint, formValues);

export function* payWithBankCard(
    c: Config,
    m: ModelState,
    a: AmountInfoState,
    v: CardFormValues
): Iterator<CallEffect> {
    const fn = createPaymentResource(c.appConfig.capiEndpoint, v);
    yield call(makePayment, c, m, v, a, fn, createRedirectUrl(c));
}
