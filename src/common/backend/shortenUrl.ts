import { fetchApi } from '../utils';

export type ShortenedUrl = {
    id: string;
    shortenedUrl: string;
    sourceUrl: string;
    expiresAt: string;
};

export type ShortenedUrlParams = {
    sourceUrl: string;
    expiresAt: string;
};

export const shortenUrl = async (
    urlShortenerEndpoint: string,
    accessToken: string,
    params: ShortenedUrlParams,
): Promise<ShortenedUrl> => {
    const path = `v1/shortened-urls`;
    const response = await fetchApi(urlShortenerEndpoint, accessToken, 'POST', path, params);
    return response.json();
};
