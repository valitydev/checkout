import { number } from 'card-validator';
import { FormEvent } from 'react';

import { replaceFullWidthChars, safeVal } from '../../../../../common/utils';

function format(num: string): string {
    num = num.replace(/\D/g, '');
    const { card } = number(num);
    if (!card) {
        return num;
    }
    const upperLength = card.lengths[card.lengths.length - 1];
    num = num.slice(0, upperLength);
    const nums = num.split('');
    for (const gap of card.gaps.reverse()) {
        nums.splice(gap, 0, ' ');
    }
    return nums.join('').trim();
}

export function formatCardNumber(e: FormEvent<HTMLInputElement>): number {
    const target = e.currentTarget;
    let value = target.value;
    value = replaceFullWidthChars(value);
    value = format(value);
    return safeVal(value, target);
}
