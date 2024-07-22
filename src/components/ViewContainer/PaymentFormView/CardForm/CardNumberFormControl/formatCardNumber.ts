import { number } from 'card-validator';
import { FormEvent } from 'react';

import { formatCard, replaceFullWidthChars, safeVal } from 'checkout/utils';

export function formatCardNumber(e: FormEvent<HTMLInputElement>): number {
    const target = e.currentTarget;
    let value = target.value;
    value = replaceFullWidthChars(value);
    value = formatCard(value, number(value));
    return safeVal(value, target);
}
