import { validatePhoneByNumberLength } from 'checkout/utils';

export function validatePhone(value: string): boolean {
    return validatePhoneByNumberLength(value);
}
