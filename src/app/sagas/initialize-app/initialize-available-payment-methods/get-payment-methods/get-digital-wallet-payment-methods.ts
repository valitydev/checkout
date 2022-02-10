import isArray from 'lodash-es/isArray';
import intersection from 'lodash-es/intersection';

import { DigitalWallet } from 'checkout/backend';
import { PaymentMethod as PaymentMethodState, PaymentMethodName as PaymentMethodNameState } from 'checkout/state';
import { logUnavailableWithConfig } from './log-unavailable-with-config';
import { logPrefix } from 'checkout/log-messages';

const providersToPaymentMethodState = (providers: string[]): PaymentMethodState[] => {
    const knownProviders = intersection(['sticpay'], providers);
    if (knownProviders.length === 0) {
        return [];
    }
    return knownProviders.map((p) => {
        switch (p) {
            // TODO typing required
            case 'sticpay':
                return { name: PaymentMethodNameState.Sticpay };
        }
    });
};

export const getDigitalWalletPaymentMethods = (
    { providers }: DigitalWallet,
    isMethod: boolean,
    paymentFlowHold: boolean,
    recurring: boolean
): PaymentMethodState[] => {
    if (!isMethod) {
        return [];
    }
    if (paymentFlowHold) {
        logUnavailableWithConfig('wallets', 'paymentFlowHold');
        return [];
    }
    if (recurring) {
        logUnavailableWithConfig('wallets', 'recurring');
        return [];
    }
    const noProvidersErrMsg = `${logPrefix} Payment method: DigitalWallet must have providers`;
    if (!isArray(providers)) {
        console.error(noProvidersErrMsg);
        return [];
    }
    if (providers.length === 0) {
        console.error(noProvidersErrMsg);
        return [];
    }
    const paymentMethodsState = providersToPaymentMethodState(providers);
    if (paymentMethodsState.length === 0) {
        console.error(`${logPrefix} There are no known providers for DigitalWallet payment method`);
        return [];
    }
    if (paymentMethodsState.length === 1) {
        return paymentMethodsState;
    }
    return [{ name: PaymentMethodNameState.DigitalWallet, subMethods: paymentMethodsState }];
};
