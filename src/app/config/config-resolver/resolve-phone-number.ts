import { validatePhoneByNumberLength } from 'checkout/utils/phone';

export const resolvePhoneNumber = (phoneNumber: string | null): string | null =>
    !validatePhoneByNumberLength(phoneNumber) ? phoneNumber : null;
