import { isSafetyUrl } from 'checkout/utils';

export const resolveRedirectUrl = (redirectUrl: string | null): string | null =>
    isSafetyUrl(redirectUrl) ? redirectUrl : null;
