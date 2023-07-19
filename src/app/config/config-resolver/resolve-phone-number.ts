import { validatePhone } from 'checkout/utils/phone';

export const resolvePhoneNumber = (phoneNumber: string | null): string | null =>
    !validatePhone(phoneNumber) ? phoneNumber : null;
