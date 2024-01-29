import { SessionInfo, ShortenedUrlParams, shortenUrl } from 'checkout/backend';

import { toSelfRedirectUrl } from './toSelfRedirectUrl';
import { PaymentMethod, PaymentModelInvoice } from '../../paymentModel';
import { StartPaymentPayload } from '../types';

export const shorten = (
    urlShortenerEndpoint: string,
    invoiceAccessToken: string,
    params: ShortenedUrlParams,
): Promise<string> =>
    shortenUrl(urlShortenerEndpoint, invoiceAccessToken, params).then(({ shortenedUrl }) => shortenedUrl);

const isSkipUserInteractionParam = (payload: StartPaymentPayload) => payload.methodName === 'PaymentTerminal';

const toRedirectUrlType = (
    payload: StartPaymentPayload,
    paymentMethods: PaymentMethod[],
    initConfigRedirectUrl: string | null,
): 'outer' | 'self' => {
    switch (payload.methodName) {
        case 'PaymentTerminal':
            const metaType = 'self';

            // TODO need to implement getting metaType from PaymentMethod[]

            // const values = formValues.values as PaymentTerminalFormValues;
            // const metaType = values?.paymentSessionInfo?.redirectUrlInfo?.type;
            // if (isNil(metaType)) {
            //     return 'self';
            // }
            // if (metaType === 'outer' && isNil(initConfigRedirectUrl)) {
            //     console.warn('Initial redirectUrl must be specified with metadata redirectUrlInfo outer type');
            //     return 'self';
            // }

            return metaType;
        default:
            return 'self';
    }
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
    const redirectUrlType = toRedirectUrlType(payload, paymentMethods, initContext.redirectUrl);
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
