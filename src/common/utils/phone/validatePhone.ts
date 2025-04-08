import { isNil } from '../isNil';
import { replaceSpaces } from '../replaceSpaces';

export function validatePhone(value: string, regex: RegExp = /^\+\d{4,15}$/): boolean {
    if (isNil(value)) {
        return true;
    }
    return !regex.test(replaceSpaces(value));
}
