import { CheckoutServiceProviderMetadata, SessionInfo, ShortenedUrlParams, shortenUrl } from 'checkout/backend';

import { toSelfRedirectUrl } from './toSelfRedirectUrl';
import { isNil } from '../../../common/utils';
import { PaymentModelInvoice } from '../../paymentModel';
import { StartPaymentPayload } from '../types';
import { extractServiceProviderMetadata } from '../utils';

export const shorten = (
    urlShortenerEndpoint: string,
    invoiceAccessToken: string,
    params: ShortenedUrlParams,
): Promise<string> =>
    shortenUrl(urlShortenerEndpoint, invoiceAccessToken, params).then(({ shortenedUrl }) => shortenedUrl);

const isSkipUserInteractionParam = (payload: StartPaymentPayload) => payload.methodName === 'PaymentTerminal';

const toRedirectUrlType = ({ paymentSessionInfo }: CheckoutServiceProviderMetadata): 'outer' | 'self' => {
    if (isNil(paymentSessionInfo)) {
        return 'self';
    }
    const metaType = paymentSessionInfo?.redirectUrlInfo?.type;
    if (isNil(metaType)) {
        return 'self';
    }
    return metaType;
};

export const createSessionInfo = async (
    model: PaymentModelInvoice,
    payload: StartPaymentPayload,
): Promise<SessionInfo> => {
    const {
        urlShortenerEndpoint,
        invoiceParams: { invoiceAccessToken, invoiceID },
        origin,
        dueDate,
        localeCode,
        initContext,
        paymentMethods,
    } = model;
    let redirectUrl;
    const serviceProviderMetadata = extractServiceProviderMetadata(paymentMethods, payload);
    const redirectUrlType = toRedirectUrlType(serviceProviderMetadata);
    switch (redirectUrlType) {
        case 'self':
            redirectUrl = await shorten(urlShortenerEndpoint, invoiceAccessToken, {
                sourceUrl: toSelfRedirectUrl(
                    origin,
                    invoiceID,
                    invoiceAccessToken,
                    initContext.redirectUrl,
                    localeCode,
                    isSkipUserInteractionParam(payload),
                ),
                expiresAt: dueDate,
            });
            break;
        case 'outer':
            redirectUrl = initContext.redirectUrl;
            break;
    }
    return { redirectUrl };
};
