import { PaymentMethodName } from 'checkout/state';
import { logUnavailableWithConfig } from './log-unavailable-with-config';
import { getServiceProviderByID, ServiceProvider, TerminalProviderCategories } from 'checkout/backend';
import { all, call, select } from 'redux-saga/effects';
import { groupBy } from 'lodash-es';
import { getAccessTokenSelector, getCapiEndpointSelector } from 'checkout/selectors';

const mapPaymentMethodNameByCategory: { [P in TerminalProviderCategories]: PaymentMethodName } = {
    euroset: PaymentMethodName.Euroset,
    qps: PaymentMethodName.QPS,
    uzcard: PaymentMethodName.Uzcard,
    onlinebanking: PaymentMethodName.OnlineBanking
};

export function* getTerminalsPaymentMethods(
    methods: { [P in TerminalProviderCategories]?: boolean } = {},
    providers: string[],
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
    const token = yield select(getAccessTokenSelector);
    const capiEndpoint = yield select(getCapiEndpointSelector);
    const serviceProviders: ServiceProvider[] = yield all(
        providers.map((id) => call(getServiceProviderByID, capiEndpoint, token, id))
    );
    const availableServiceProvidersGroups = groupBy(
        serviceProviders.filter(({ category }) => methods[category]),
        'category'
    );
    return Object.entries(availableServiceProvidersGroups).map(([category, serviceProvidersGroup]) => ({
        name: mapPaymentMethodNameByCategory[category],
        serviceProviders: serviceProvidersGroup
    }));
}
