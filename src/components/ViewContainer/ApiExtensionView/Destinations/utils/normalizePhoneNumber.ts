export const normalizePhoneNumber = (phoneNumber: string): string =>
    phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
