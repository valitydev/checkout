import { Locale } from 'checkout/contexts';

export interface NotificationItem {
    title: string;
    content: string[];
}

export const mapNotification = (code: string, l: Locale): string | NotificationItem[] => {
    const notifications = l?.['p2p.notification'] ?? {};
    return notifications[code] ?? code;
};
