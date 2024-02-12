import { AsYouType } from 'libphonenumber-js/min';
import { FormEvent } from 'react';

export const formatOnInput = (value: string): string => {
    if (value === '') {
        return value;
    }
    if (value.slice(0, 1) === '+') {
        return new AsYouType().input(value);
    }
    return `+${value}`;
};

export const formatPhoneNumber = (e: FormEvent<HTMLInputElement>, formatter = formatOnInput) => {
    const target = e.currentTarget as HTMLInputElement;
    target.value = formatter(target.value);
};
