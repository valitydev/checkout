import { FormEvent } from 'react';
import { AsYouType } from 'libphonenumber-js/min';

const format = (value: string): string => (value.slice(0, 1) === '+' ? new AsYouType().input(value) : '+');

export const formatPhoneNumber = (e: FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget as HTMLInputElement;
    target.value = format(target.value);
};
