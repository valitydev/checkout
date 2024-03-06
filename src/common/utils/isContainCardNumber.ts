import * as cardValidator from 'card-validator';

export const isContainCardNumber = (email: string) => {
    const splitted = email.trim().split('@');
    for (const numberOption of splitted) {
        if (cardValidator.number(numberOption).isValid) {
            return true;
        }
    }
    return false;
};
