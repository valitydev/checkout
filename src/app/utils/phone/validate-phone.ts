import isNil from '../is-nil';
import replaceSpaces from '../replace-spaces';

export function validatePhone(value: string): boolean {
    if (isNil(value)) {
        return true;
    }
    const regex = /^\+\d{4,15}$/;
    return !regex.test(replaceSpaces(value));
}
