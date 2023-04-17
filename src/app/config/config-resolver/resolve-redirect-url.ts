import { isSafetyUrl } from 'checkout/utils/is-safety-url';

export const resolveRedirectUrl = (redirectUrl: string | null): string | null =>
    isSafetyUrl(redirectUrl) ? redirectUrl : null;
