import { cardExpiryVal } from './cardExpiryVal';
import { validateCardExpiry } from './validateCardExpiry';

export function validateExpireDate(value: any): boolean {
    if (!value) {
        return true;
    }
    const formatVal = cardExpiryVal(value);
    return !validateCardExpiry(formatVal);
}
