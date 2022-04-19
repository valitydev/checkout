import groupBy from 'lodash-es/groupBy';

import { METADATA_NAMESPACE, ServiceProvider } from 'checkout/backend';
import {
    DigitalWalletPaymentMethod,
    PaymentMethodName as PaymentMethodNameState,
    KnownDigitalWalletProviderCategories
} from 'checkout/state';
import { logUnavailableWithConfig } from './log-unavailable-with-config';
import { assertUnreachable } from 'checkout/utils';

const metadataReducer = (result: ServiceProvider[], serviceProvider: ServiceProvider): ServiceProvider[] =>
    serviceProvider?.metadata?.[METADATA_NAMESPACE] ? result.concat(serviceProvider) : result;

const categoryReducer = (
    result: ServiceProvider[],
    [category, serviceProviders]: [KnownDigitalWalletProviderCategories, ServiceProvider[]]
): ServiceProvider[] => {
    switch (category) {
        case KnownDigitalWalletProviderCategories.DigitalWallet:
            result = result.concat(serviceProviders.reduce(metadataReducer, []));
            break;
        default:
            assertUnreachable(category);
    }
    return result;
};

export const getDigitalWalletPaymentMethods = (
    serviceProviders: ServiceProvider[],
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
    const groupedByCategory = Object.entries(groupBy(serviceProviders, 'category'));
    const reduced = groupedByCategory.reduce(categoryReducer, []);
    return [
        {
            name: PaymentMethodNameState.DigitalWallet,
            serviceProviders: reduced
        }
    ];
};
