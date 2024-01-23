import { number } from 'card-validator';

export const isSecureCodeAvailable = (cardNumber: string): boolean => {
    const cardType = number(cardNumber)?.card?.type;
    return !['uzcard', 'humo'].includes(cardType);
};
