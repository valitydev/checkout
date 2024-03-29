import { extractError } from 'checkout/utils';

export const formatPhoneNumber = async (phoneNumber: string): Promise<string> => {
    try {
        const lib = await import('libphonenumber-js/min');
        return new lib.AsYouType().input(phoneNumber);
    } catch (error) {
        console.error(`Error loading the libphonenumber-js library ${extractError(error)}`);
        return phoneNumber;
    }
};
