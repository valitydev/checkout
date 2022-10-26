import { FormEvent } from 'react';
import { MetadataFieldFormatter } from 'checkout/backend';
import isNil from 'lodash-es/isNil';
import { safeVal } from 'checkout/utils';

export const formatNumbersOnly = ({ maxLength }: MetadataFieldFormatter) => (e: FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    let value = target.value;
    value = value.replace(/\D/g, '');
    if (!isNil(maxLength)) {
        value = value.slice(0, maxLength);
    }
    return safeVal(value, target);
};
