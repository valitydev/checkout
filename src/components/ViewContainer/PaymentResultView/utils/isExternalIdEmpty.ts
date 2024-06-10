import { PaymentCondition, PaymentStarted } from 'checkout/paymentCondition';
import { isNil } from 'checkout/utils';

export const isExternalIdEmpty = (conditions: PaymentCondition[]): boolean => {
    const found = conditions.find((condition) => condition.name === 'paymentStarted') as PaymentStarted;
    if (isNil(found)) return false;
    return isNil(found.externalId);
};
