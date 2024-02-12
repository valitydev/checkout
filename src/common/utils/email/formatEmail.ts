import { FormEvent } from 'react';

import { safeVal } from '../safeVal';

export const formatEmail = (e: FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    let value = target.value;
    value = value.replace(/ +/, '');
    return safeVal(value, target);
};
