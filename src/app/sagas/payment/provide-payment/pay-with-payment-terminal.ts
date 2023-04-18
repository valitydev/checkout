import { call, CallEffect } from 'redux-saga/effects';

import { AmountInfoState, ModelState, PaymentTerminalFormValues } from 'checkout/state';
import { Config } from 'checkout/config';
import { makePayment } from './make-payment';
import { createPaymentTerminal } from '../../create-payment-resource';
import { PaymentSessionInfoMetadata } from 'checkout/backend';
import { prepareSelfRedirectUrl } from './prepare-self-redirect-url';
import { shorten } from './shorten';

const prepareRedirectUrl = (
    paymentSessionInfo: PaymentSessionInfoMetadata,
    origin: string,
    invoiceID: string,
    invoiceAccessToken: string,
    initConfigRedirectUrl: string
): { url: string; needShort: boolean } => {
    const selfRedirect = {
        needShort: true,
        url: prepareSelfRedirectUrl(origin, invoiceID, invoiceAccessToken, initConfigRedirectUrl, true)
    };
    if (!paymentSessionInfo || !paymentSessionInfo?.redirectUrlInfo) {
        return selfRedirect;
    }
    switch (paymentSessionInfo.redirectUrlInfo.type) {
        case 'outer':
            return { needShort: false, url: initConfigRedirectUrl };
        case 'self':
            return selfRedirect;
    }
};

const createRedirectUrl = (
    { initConfig, origin, appConfig }: Config,
    paymentSessionInfo: PaymentSessionInfoMetadata
) => (invoiceID: string, invoiceAccessToken: string, invoiceDueDate: string): Promise<string | null> => {
    const { url, needShort } = prepareRedirectUrl(
        paymentSessionInfo,
        origin,
        invoiceID,
        invoiceAccessToken,
        initConfig.redirectUrl
    );
    return needShort
        ? shorten(appConfig.urlShortenerEndpoint, invoiceAccessToken, {
              sourceUrl: url,
              expiresAt: invoiceDueDate
          })
        : Promise.resolve(url);
};

const createPaymentResource = (endpoint: string, provider: string, metadata: any) =>
    createPaymentTerminal.bind(null, endpoint, provider, metadata);

export function* payWithPaymentTerminal(
    c: Config,
    m: ModelState,
    a: AmountInfoState,
    v: PaymentTerminalFormValues
): Iterator<CallEffect> {
    const fn = createPaymentResource(c.appConfig.capiEndpoint, v.provider, v.metadata);
    yield call(makePayment, c, m, v, a, fn, createRedirectUrl(c, v.paymentSessionInfo));
}
