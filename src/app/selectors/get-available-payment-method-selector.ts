import { PaymentMethodName, State, PaymentMethod } from 'checkout/state';

export const getAvailablePaymentMethodSelector = (methodName: PaymentMethodName) => <T extends PaymentMethod>(
    state: State
): T => state.availablePaymentMethods.find((m) => m.name === methodName) as T;
