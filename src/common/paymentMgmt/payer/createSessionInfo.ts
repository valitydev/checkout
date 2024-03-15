import { toSelfRedirectUrl } from './toSelfRedirectUrl';
import { ShortenedUrlParams, shortenUrl } from '../../backend';
import { PaymentSessionInfoMetadata } from '../../backend/payments';
import { CommonPaymentModel, InvoiceContext } from '../../paymentModel';
import { isNil } from '../../utils';
import { findMetadata } from '../../utils/findMetadata';
import { StartPaymentPayload } from '../types';

const shorten = async (
    urlShortenerEndpoint: string,
    invoiceAccessToken: string,
    params: ShortenedUrlParams,
): Promise<string> => {
    try {
        const result = await shortenUrl(urlShortenerEndpoint, invoiceAccessToken, params);
        return result.shortenedUrl;
    } catch (error) {
        return params.sourceUrl;
    }
};

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
) => {
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
