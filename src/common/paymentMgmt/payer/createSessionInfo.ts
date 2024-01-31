import { PaymentSessionInfoMetadata, SessionInfo, ShortenedUrlParams, shortenUrl } from 'checkout/backend';

import { toSelfRedirectUrl } from './toSelfRedirectUrl';
import { findMetadata, isNil } from '../../../common/utils';
import { PaymentModelInvoice } from '../../paymentModel';
import { StartPaymentPayload } from '../types';

export const shorten = (
    urlShortenerEndpoint: string,
    invoiceAccessToken: string,
    params: ShortenedUrlParams,
): Promise<string> =>
    shortenUrl(urlShortenerEndpoint, invoiceAccessToken, params).then(({ shortenedUrl }) => shortenedUrl);

const isSkipUserInteractionParam = (payload: StartPaymentPayload) => payload.methodName === 'PaymentTerminal';

const toRedirectUrlType = (paymentSessionInfo: PaymentSessionInfoMetadata): 'outer' | 'self' => {
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
        serviceProviders,
    } = model;
    let redirectUrl;
    let paymentSessionInfo;
    if (payload.methodName === 'PaymentTerminal') {
        const metadata = findMetadata(serviceProviders, payload.values.provider);
        paymentSessionInfo = metadata.paymentSessionInfo;
    }
    const redirectUrlType = toRedirectUrlType(paymentSessionInfo);
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
