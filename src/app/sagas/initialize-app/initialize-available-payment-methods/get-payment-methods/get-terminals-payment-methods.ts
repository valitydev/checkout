import groupBy from 'lodash-es/groupBy';

import { KnownProviderCategories, PaymentMethod, PaymentMethodName } from 'checkout/state';
import { ServiceProvider } from 'checkout/backend';
import { logUnavailableWithConfig } from './log-unavailable-with-config';
import { assertUnreachable } from 'checkout/utils';

type InitConfigChunk = {
    onlineBanking: boolean;
    netBanking: boolean;
    qps: boolean;
    paymentFlowHold: boolean;
    recurring: boolean;
};

const categoryReducer = ({ onlineBanking, netBanking, qps }: Partial<InitConfigChunk>) => (
    result: PaymentMethod[],
    [category, serviceProviders]: [KnownProviderCategories, ServiceProvider[]]
) => {
    let paymentMethod;
    switch (category) {
        case KnownProviderCategories.OnlineBanking:
            paymentMethod = onlineBanking && {
                name: PaymentMethodName.OnlineBanking,
                serviceProviders
            };
            break;
        case KnownProviderCategories.NetBanking:
            paymentMethod = netBanking && {
                name: PaymentMethodName.NetBanking,
                serviceProviders
            };
            break;
        case KnownProviderCategories.UPI:
            paymentMethod = qps && {
                name: PaymentMethodName.UPI
            };
            break;
        default:
            assertUnreachable(category);
    }
    return paymentMethod ? result.concat([paymentMethod]) : result;
};

export const getTerminalsPaymentMethods = (
    serviceProviders: ServiceProvider[],
    { paymentFlowHold, recurring, onlineBanking, netBanking, qps }: InitConfigChunk
): PaymentMethod[] => {
    if (paymentFlowHold) {
        logUnavailableWithConfig('terminals', 'paymentFlowHold');
        return [];
    }
    if (recurring) {
        logUnavailableWithConfig('terminals', 'recurring');
        return [];
    }
    const groupedByCategory = Object.entries(groupBy(serviceProviders, 'category'));
    return groupedByCategory.reduce(categoryReducer({ onlineBanking, netBanking, qps }), []);
};
