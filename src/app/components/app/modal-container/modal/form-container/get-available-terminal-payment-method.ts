import {
    KnownProviderCategories,
    PaymentMethod,
    PaymentMethodName,
    PaymentTerminalPaymentMethod
} from 'checkout/state';
import isNil from 'checkout/utils/is-nil';

export const getAvailableTerminalPaymentMethod = (
    availablePaymentMethods: PaymentMethod[],
    category: KnownProviderCategories
): PaymentTerminalPaymentMethod | null => {
    if (isNil(category)) {
        return null;
    }
    const found = availablePaymentMethods.find((m) => {
        if (m.name !== PaymentMethodName.PaymentTerminal) {
            return false;
        }
        return (m as PaymentTerminalPaymentMethod).category === category;
    });
    return found ? (found as PaymentTerminalPaymentMethod) : null;
};
