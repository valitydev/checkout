import groupBy from 'lodash-es/groupBy';

import { DigitalWallet, METADATA_NAMESPACE, ServiceProvider } from 'checkout/backend';
import {
    DigitalWalletPaymentMethod,
    PaymentMethodName as PaymentMethodNameState,
    KnownDigitalWalletProviderCategories
} from 'checkout/state';
import { logUnavailableWithConfig } from './log-unavailable-with-config';
import { assertUnreachable } from 'checkout/utils';
import { filterByPaymentMethodProviders } from './filter-by-payment-method-providers';

const metadataReducer = (result: ServiceProvider[], serviceProvider: ServiceProvider): ServiceProvider[] =>
    serviceProvider?.metadata?.[METADATA_NAMESPACE] ? result.concat(serviceProvider) : result;

const categoryReducer = (
    result: ServiceProvider[],
    [category, serviceProviders]: [KnownDigitalWalletProviderCategories, ServiceProvider[]]
): ServiceProvider[] => {
    switch (category) {
        case KnownDigitalWalletProviderCategories.DigitalWallet:
        case KnownDigitalWalletProviderCategories.TerminalWallet:
            result = result.concat(serviceProviders.reduce(metadataReducer, []));
            break;
        default:
            assertUnreachable(category);
    }
    return result;
};

export const getDigitalWalletPaymentMethods = (
    { providers }: DigitalWallet,
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
    const filtered = serviceProviders.filter(filterByPaymentMethodProviders(providers));
    const groupedByCategory = Object.entries(groupBy(filtered, 'category'));
    const reduced = groupedByCategory.reduce(categoryReducer, []);
    return [
        {
            name: PaymentMethodNameState.DigitalWallet,
            serviceProviders: reduced
        }
    ];
};
