import { Locale } from 'checkout/contexts';

export const mapNotification = (code: string, l: Locale): string => {
    const notifications = l?.['p2p.notification'] ?? {};
    return notifications[code] ?? code;
};
