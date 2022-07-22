import { validatePhoneByNumberLength } from 'checkout/utils';

export const resolvePhoneNumber = (phoneNumber: string | null): string | null =>
    !validatePhoneByNumberLength(phoneNumber) ? phoneNumber : null;
