import { FormEvent } from 'react';

import { safeVal } from 'checkout/utils';

export const formatCardHolder = (e: FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    let value = target.value;
    value = value.toUpperCase();
    return safeVal(value, target);
};
