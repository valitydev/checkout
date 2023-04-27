import {
    DigitalWalletPaymentMethod,
    KnownProviderCategories,
    PaymentMethod,
    PaymentMethodName,
    PaymentTerminalPaymentMethod
} from 'checkout/state';
import isNil from 'checkout/utils/is-nil';

export const terminalDigitalWalletReducer = (
    acc: PaymentMethod[],
    curr: PaymentMethod,
    _index,
    methods: PaymentMethod[]
) => {
    if (curr.name === PaymentMethodName.PaymentTerminal) {
        const paymentTerminal = curr as PaymentTerminalPaymentMethod;
        if (paymentTerminal.category === KnownProviderCategories.DigitalWallet) {
            const digitalWallet = methods.find((m) => m.name === PaymentMethodName.DigitalWallet);
            if (digitalWallet) {
                return acc;
            }
        }
    }
    if (curr.name === PaymentMethodName.DigitalWallet) {
        const digitalWallet = curr as DigitalWalletPaymentMethod;
        const paymentTerminal = methods.find(
            (m) => m.name === PaymentMethodName.PaymentTerminal
        ) as PaymentTerminalPaymentMethod;
        if (!isNil(paymentTerminal) && paymentTerminal.category === KnownProviderCategories.DigitalWallet) {
            digitalWallet.serviceProviders = digitalWallet.serviceProviders.concat(paymentTerminal.serviceProviders);
            return acc.concat(digitalWallet);
        }
    }
    return acc.concat(curr);
};
