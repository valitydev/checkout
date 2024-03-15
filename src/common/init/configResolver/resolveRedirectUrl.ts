import { isSafetyUrl } from '../../utils';

export const resolveRedirectUrl = (redirectUrl: string | null): string | null =>
    isSafetyUrl(redirectUrl) ? redirectUrl : null;
