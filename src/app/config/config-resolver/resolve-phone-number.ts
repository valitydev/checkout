import { validatePhone } from '../../../common/utils';

export const resolvePhoneNumber = (phoneNumber: string | null): string | null =>
    !validatePhone(phoneNumber) ? phoneNumber : null;
