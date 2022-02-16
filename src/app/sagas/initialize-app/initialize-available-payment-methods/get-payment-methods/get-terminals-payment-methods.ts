import { PaymentMethodName } from 'checkout/state';
import { logUnavailableWithConfig } from './log-unavailable-with-config';
import { ServiceProvider, TerminalProviderCategories } from 'checkout/backend';
import { groupBy } from 'lodash-es';
import { assertMetadata } from 'checkout/sagas/initialize-app/initialize-available-payment-methods/get-payment-methods/assert-metadata';

const mapPaymentMethodNameByCategory: { [P in TerminalProviderCategories]: PaymentMethodName } = {
    euroset: PaymentMethodName.Euroset,
    qps: PaymentMethodName.QPS,
    uzcard: PaymentMethodName.Uzcard,
    onlinebanking: PaymentMethodName.OnlineBanking
};

export function getTerminalsPaymentMethods(
    methods: { [P in TerminalProviderCategories]?: boolean } = {},
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
        name: mapPaymentMethodNameByCategory[category],
        serviceProviders: serviceProvidersGroup
    }));
}
