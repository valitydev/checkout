import { extractError } from 'checkout/utils';

export const parseNationalNumber =
    (forCountries: string[]) =>
    async (phoneNumber: string): Promise<string> => {
        try {
            const lib = await import('libphonenumber-js/min');
            const parsed = lib.parsePhoneNumber(phoneNumber);
            if (forCountries.includes(parsed.country)) {
                return parsed.nationalNumber;
            }
            return phoneNumber;
        } catch (error) {
            console.error(`Parse national number failed: ${extractError(error)}`);
            return phoneNumber;
        }
    };
