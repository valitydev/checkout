import isArray from 'lodash-es/isArray';
import intersection from 'lodash-es/intersection';

import { DigitalWallet } from 'checkout/backend';
import {
    DigitalWalletPaymentMethod,
    PaymentMethodName as PaymentMethodNameState,
    KnownDigitalWalletProviders
} from 'checkout/state';
import { logUnavailableWithConfig } from './log-unavailable-with-config';
import { logPrefix } from 'checkout/log-messages';

export const getDigitalWalletPaymentMethods = (
    { providers }: DigitalWallet,
    isMethod: boolean,
    paymentFlowHold: boolean,
    recurring: boolean
): DigitalWalletPaymentMethod[] => {
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
    const knownProviders = intersection(Object.keys(KnownDigitalWalletProviders), providers);
    if (knownProviders.length === 0) {
        console.error(`${logPrefix} There are no known providers for DigitalWallet payment method`);
        return [];
    }
    return [{ name: PaymentMethodNameState.DigitalWallet, providers: knownProviders as KnownDigitalWalletProviders[] }];
};
