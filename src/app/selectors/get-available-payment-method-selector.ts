import {
    PaymentMethodName,
    State,
    KnownProviderCategories,
    PaymentTerminalPaymentMethod,
    PaymentMethod
} from 'checkout/state';

export const getAvailableTerminalPaymentMethodSelector = (category: KnownProviderCategories) => (
    state: State
): PaymentTerminalPaymentMethod | null => {
    const found = state.availablePaymentMethods.find((m) => {
        if (m.name !== PaymentMethodName.PaymentTerminal) {
            return false;
        }
        return (m as PaymentTerminalPaymentMethod).category === category;
    });
    return found ? (found as PaymentTerminalPaymentMethod) : null;
};

export const getAvailablePaymentMethodSelector = <T extends PaymentMethod>(methodName: PaymentMethodName) => (
    s: State
): T => s.availablePaymentMethods.find((m) => m.name === methodName) as T;
