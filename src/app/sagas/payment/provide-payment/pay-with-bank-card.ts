import { call, CallEffect } from 'redux-saga/effects';
import { CardFormValues } from 'checkout/state';
import { createCardData } from '../../create-payment-resource';
import { makePayment } from './make-payment';
import { prepareSelfRedirectUrl } from './prepare-self-redirect-url';
import { shorten } from './shorten';
import { AppContext } from 'checkout/actions';

const createRedirectUrl = ({ initConfig, appConfig, origin }: AppContext) => (
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

export function* payWithBankCard(context: AppContext, v: CardFormValues): Iterator<CallEffect> {
    const fn = createPaymentResource(context.appConfig.capiEndpoint, v);
    yield call(makePayment, context, v, fn, createRedirectUrl(context));
}
