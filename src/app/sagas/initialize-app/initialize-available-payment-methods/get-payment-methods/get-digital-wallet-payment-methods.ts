import { DigitalWallet } from 'checkout/backend';
import { PaymentMethod as PaymentMethodState, PaymentMethodName as PaymentMethodNameState } from 'checkout/state';
import { logUnavailableWithConfig } from './log-unavailable-with-config';

export const getDigitalWalletPaymentMethods = (
    { providers }: DigitalWallet,
    isMethod: boolean,
    paymentFlowHold: boolean,
    recurring: boolean
): PaymentMethodState[] => {
    if (isMethod) {
        if (paymentFlowHold) {
            logUnavailableWithConfig('wallets', 'paymentFlowHold');
        } else if (recurring) {
            logUnavailableWithConfig('wallets', 'recurring');
        } else {
            return [{ name: PaymentMethodNameState.DigitalWallet, providers }];
        }
    }
    return [];
};
