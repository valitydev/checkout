import parse from 'libphonenumber-js/min';

export function validatePhoneByNumberLength(value: string, nationalNumberLength = 10): boolean {
    if (!value) {
        return true;
    }
    const parsed = parse(value);
    return !parsed || parsed.nationalNumber.length !== nationalNumberLength;
}
