import { safeVal } from 'checkout/utils';
import { FormEvent } from 'react';

export const formatCardHolder = (e: FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    let value = target.value;
    value = value.toUpperCase();
    return safeVal(value, target);
};
