import { ShortenedUrlParams, shortenUrl } from 'checkout/backend';

export const shorten = (
    urlShortenerEndpoint: string,
    invoiceAccessToken: string,
    params: ShortenedUrlParams
): Promise<string> =>
    shortenUrl(urlShortenerEndpoint, invoiceAccessToken, params).then(({ shortenedUrl }) => shortenedUrl);
