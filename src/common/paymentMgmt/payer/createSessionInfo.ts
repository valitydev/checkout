import { PaymentSessionInfoMetadata, SessionInfo, ShortenedUrlParams, shortenUrl } from 'checkout/backend';

import { toSelfRedirectUrl } from './toSelfRedirectUrl';
import { findMetadata, isNil } from '../../../common/utils';
import { CommonPaymentModel, InvoiceContext } from '../../paymentModel';
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
    model: CommonPaymentModel,
    invoiceContext: InvoiceContext,
    payload: StartPaymentPayload,
): Promise<SessionInfo> => {
    const { urlShortenerEndpoint, origin, localeCode, initContext, serviceProviders } = model;
    const {
        invoiceParams: { invoiceAccessToken, invoiceID },
        dueDate,
    } = invoiceContext;
    let paymentSessionInfo;
    if (payload.methodName === 'PaymentTerminal') {
        const metadata = findMetadata(serviceProviders, payload.values.provider);
        paymentSessionInfo = metadata.paymentSessionInfo;
    }
    const redirectUrlType = toRedirectUrlType(paymentSessionInfo);
    const selfRedirectUrl = toSelfRedirectUrl(
        origin,
        invoiceID,
        invoiceAccessToken,
        initContext.redirectUrl,
        localeCode,
        isSkipUserInteractionParam(payload),
    );
    let redirectUrl = selfRedirectUrl;
    switch (redirectUrlType) {
        case 'self':
            redirectUrl = await shorten(urlShortenerEndpoint, invoiceAccessToken, {
                sourceUrl: selfRedirectUrl,
                expiresAt: dueDate,
            });
            break;
        case 'outer':
            if (!isNil(initContext.redirectUrl)) {
                redirectUrl = initContext.redirectUrl;
            }
            break;
    }
    return { redirectUrl };
};
