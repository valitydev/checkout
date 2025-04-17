import { AsYouType } from 'libphonenumber-js/min';
import { FormEvent } from 'react';

import { PhoneNumberFormatter } from 'checkout/backend/payments';
import { safeVal } from 'checkout/utils';

const formatOnInput = (value: string, maxLength: number): string => {
    if (value === '') {
        return value;
    }

    // Remove all non-digit characters except '+'
    const cleanedValue = value.replace(/[^\d+]/g, '');

    // Ensure there's only one '+' at the start
    const normalizedValue = cleanedValue.startsWith('+') ? cleanedValue : `+${cleanedValue}`;

    // Format the number using AsYouType
    const formattedValue = new AsYouType().input(normalizedValue);

    // Count only digits (excluding '+' and formatting characters)
    const digitCount = formattedValue.replace(/[^\d]/g, '').length;

    // If we exceed maxLength digits, trim the excess
    if (digitCount > maxLength) {
        // Re-format the truncated number
        const truncatedDigits = formattedValue.replace(/[^\d]/g, '').slice(0, maxLength);
        return new AsYouType().input(`+${truncatedDigits}`);
    }

    return formattedValue;
};

export const formatPhoneNumber =
    ({ length }: PhoneNumberFormatter) =>
    (e: FormEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        const value = formatOnInput(target.value, length);
        return safeVal(value, target);
    };
