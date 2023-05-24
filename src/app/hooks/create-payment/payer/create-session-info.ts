import { PaymentMethodName, SessionInfo, ShortenedUrlParams, shortenUrl } from 'checkout/backend';
import { FormData, PayableInvoiceData } from '../types';
import { toSelfRedirectUrl } from './to-self-redirect-url';
import { PaymentTerminalFormValues } from 'checkout/state';
import isNil from 'checkout/utils/is-nil';

export const shorten = (
    urlShortenerEndpoint: string,
    invoiceAccessToken: string,
    params: ShortenedUrlParams
): Promise<string> =>
    shortenUrl(urlShortenerEndpoint, invoiceAccessToken, params).then(({ shortenedUrl }) => shortenedUrl);

const isSkipUserInteractionParam = (method: PaymentMethodName) => method === PaymentMethodName.PaymentTerminal;

const toRedirectUrlType = (formValues: FormData, initConfigRedirectUrl: string | null): 'outer' | 'self' => {
    switch (formValues.method) {
        case PaymentMethodName.PaymentTerminal:
            const values = formValues.values as PaymentTerminalFormValues;
            const metaType = values?.paymentSessionInfo?.redirectUrlInfo?.type;
            if (isNil(metaType)) {
                return 'self';
            }
            if (metaType === 'outer' && isNil(initConfigRedirectUrl)) {
                console.error('Initial redirectUrl must be specified with metadata redirectUrlInfo outer type');
                return 'self';
            }
            return metaType;
        default:
            return 'self';
    }
};

export const createSessionInfo = async (
    urlShortenerEndpoint: string,
    origin: string,
    initConfigRedirectUrl: string | null,
    { invoice, invoiceAccessToken }: PayableInvoiceData,
    formValues: FormData
): Promise<SessionInfo> => {
    let redirectUrl;
    const redirectUrlType = toRedirectUrlType(formValues, initConfigRedirectUrl);
    switch (redirectUrlType) {
        case 'self':
            redirectUrl = await shorten(urlShortenerEndpoint, invoiceAccessToken, {
                sourceUrl: toSelfRedirectUrl(
                    origin,
                    invoice.id,
                    invoiceAccessToken,
                    initConfigRedirectUrl,
                    isSkipUserInteractionParam(formValues.method)
                ),
                expiresAt: invoice.dueDate
            });
            break;
        case 'outer':
            redirectUrl = initConfigRedirectUrl;
            break;
    }
    return { redirectUrl };
};
