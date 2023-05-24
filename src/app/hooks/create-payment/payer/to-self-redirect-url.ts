import { serializeUrlParams } from '../../../../serialize-url-params';

export const toSelfRedirectUrl = (
    origin: string,
    invoiceID: string,
    invoiceAccessToken: string,
    redirectUrl: string,
    skipUserInteraction: boolean
) =>
    `${origin}/v1/checkout.html?${serializeUrlParams({
        invoiceID,
        invoiceAccessToken,
        redirectUrl,
        skipUserInteraction
    })}`;
