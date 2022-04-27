import { fetchCapi } from './fetch-capi';
import { ShortenedUrl, ShortenedUrlParams } from './model';

export const shortenUrl = (
    urlShortenerEndpoint: string,
    accessToken: string,
    params: ShortenedUrlParams
): Promise<ShortenedUrl> =>
    fetchCapi({
        method: 'POST',
        endpoint: `${urlShortenerEndpoint}/v1/shortened-urls`,
        accessToken,
        body: params
    });
