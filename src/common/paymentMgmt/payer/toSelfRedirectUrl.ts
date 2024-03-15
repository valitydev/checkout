import { isNil } from '../../utils';

export const toSelfRedirectUrl = (
    origin: string,
    invoiceID: string,
    invoiceAccessToken: string,
    redirectUrl: string,
    locale: string,
    skipUserInteraction: boolean,
) => {
    const queryParams = new URLSearchParams({
        invoiceID,
        invoiceAccessToken,
        redirectUrl,
        locale,
        skipUserInteraction: skipUserInteraction.toString(),
    });
    if (!isNil(redirectUrl)) {
        queryParams.append('redirectUrl', redirectUrl);
    }
    return `${origin}/v1/checkout.html?${queryParams.toString()}`;
};
