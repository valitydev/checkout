import { validatePhone } from 'checkout/utils';

export const resolvePhoneNumber = (phoneNumber: string | null): string | null =>
    !validatePhone(phoneNumber) ? phoneNumber : null;
