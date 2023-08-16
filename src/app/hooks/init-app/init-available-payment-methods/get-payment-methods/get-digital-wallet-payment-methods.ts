import { DigitalWallet, METADATA_NAMESPACE, ServiceProvider } from 'checkout/backend';
import { assertUnreachable } from 'checkout/utils';
import groupBy from 'checkout/utils/group-by';

import { filterByPaymentMethodProviders } from './filter-by-payment-method-providers';
import {
    DigitalWalletPaymentMethod,
    PaymentMethodName as PaymentMethodNameState,
    KnownDigitalWalletProviderCategories,
} from '../types';

const metadataReducer = (result: ServiceProvider[], serviceProvider: ServiceProvider): ServiceProvider[] =>
    serviceProvider?.metadata?.[METADATA_NAMESPACE] ? result.concat(serviceProvider) : result;

const categoryReducer = (
    result: ServiceProvider[],
    [category, serviceProviders]: [KnownDigitalWalletProviderCategories, ServiceProvider[]],
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
    { providers }: DigitalWallet,
    serviceProviders: ServiceProvider[],
    isMethod: boolean,
    paymentFlowHold: boolean,
    recurring: boolean,
): DigitalWalletPaymentMethod[] => {
    if (!isMethod) {
        return [];
    }
    if (paymentFlowHold) {
        return [];
    }
    if (recurring) {
        return [];
    }
    const filtered = serviceProviders.filter(filterByPaymentMethodProviders(providers));
    const groupedByCategory = Object.entries(groupBy(filtered, 'category'));
    const reduced = groupedByCategory.reduce(categoryReducer, []);
    return [
        {
            name: PaymentMethodNameState.DigitalWallet,
            serviceProviders: reduced,
        },
    ];
};
