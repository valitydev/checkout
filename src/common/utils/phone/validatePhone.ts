import { isNil } from '../isNil';
import { replaceSpaces } from '../replaceSpaces';

export function validatePhone(value: string): boolean {
    if (isNil(value)) {
        return true;
    }
    const regex = /^\+\d{4,15}$/;
    return !regex.test(replaceSpaces(value));
}
