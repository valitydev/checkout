import { PaymentCondition, PaymentStarted } from 'checkout/paymentCondition';

export const isInstantPayment = (conditions: PaymentCondition[]): boolean => {
    const paymentStarted = conditions.find((condition) => condition.name === 'paymentStarted');
    return (paymentStarted as PaymentStarted).isInstantPayment;
};
