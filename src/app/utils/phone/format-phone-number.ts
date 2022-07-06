import { AsYouType } from 'libphonenumber-js/min';

export const formatPhoneNumber = (value: string): string =>
    value.slice(0, 1) === '+' ? new AsYouType().input(value) : '+';
