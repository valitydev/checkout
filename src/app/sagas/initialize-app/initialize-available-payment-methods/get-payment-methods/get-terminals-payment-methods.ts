import { KnownProviderCategories, PaymentMethodName } from 'checkout/state';
import { logUnavailableWithConfig } from './log-unavailable-with-config';
import { ServiceProvider } from 'checkout/backend';
import { groupBy } from 'lodash-es';
import { assertMetadata } from './assert-metadata';

const mapProviderCategoryToPaymentMethodName: { [P in KnownProviderCategories]: PaymentMethodName } = {
    [KnownProviderCategories.Euroset]: PaymentMethodName.Euroset,
    [KnownProviderCategories.QPS]: PaymentMethodName.QPS,
    [KnownProviderCategories.Uzcard]: PaymentMethodName.Uzcard,
    [KnownProviderCategories.OnlineBanking]: PaymentMethodName.OnlineBanking
};

export function getTerminalsPaymentMethods(
    methods: { [P in KnownProviderCategories]?: boolean } = {},
    serviceProviders: ServiceProvider[],
    paymentFlowHold: boolean,
    recurring: boolean
) {
    if (paymentFlowHold) {
        logUnavailableWithConfig('terminals', 'paymentFlowHold');
        return [];
    }
    if (recurring) {
        logUnavailableWithConfig('terminals', 'recurring');
        return [];
    }
    serviceProviders.forEach((serviceProvider) => assertMetadata(serviceProvider.id, serviceProvider.metadata));
    const availableServiceProvidersGroups = groupBy(
        serviceProviders.filter(({ category }) => methods[category]),
        'category'
    );
    return Object.entries(availableServiceProvidersGroups).map(([category, serviceProvidersGroup]) => ({
        name: mapProviderCategoryToPaymentMethodName[category],
        serviceProviders: serviceProvidersGroup
    }));
}
