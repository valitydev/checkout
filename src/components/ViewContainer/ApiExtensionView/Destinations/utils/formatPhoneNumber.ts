import { extractError } from 'checkout/utils';

export const formatPhoneNumber = async (phoneNumber: string): Promise<string> => {
    try {
        const lib = await import('libphonenumber-js/min');
        const instance = new lib.AsYouType();
        return instance.input(phoneNumber);
    } catch (error) {
        console.error(`Format phone number failed: ${extractError(error)}`);
        return phoneNumber;
    }
};
