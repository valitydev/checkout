import { number } from 'card-validator';
import { replaceFullWidthChars } from 'checkout/utils';

export function formatCVC(value: string, cardNumber: string): string {
    value = replaceFullWidthChars(value);
    const { card } = number(cardNumber);
    const size = card?.code?.size || 4;
    value = value.replace(/\D/g, '').slice(0, size);
    return value;
}
