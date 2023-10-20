import * as cardValidator from 'card-validator';

/**
 * 2 to 63 because domain name can be from 2 characters to 63 characters only by RFC 1035
 */
const EMAIL_REGEXP = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,63}$/i;

const isContainCardNumber = (email: string) => {
    const splitted = email.trim().split('@');
    for (const numberOption of splitted) {
        if (cardValidator.number(numberOption).isValid) {
            return true;
        }
    }
    return false;
};

export function validateEmail(value: string): boolean {
    return !value || !value.trim() || !EMAIL_REGEXP.test(value.trim()) || isContainCardNumber(value);
}
