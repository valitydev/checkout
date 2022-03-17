import groupBy from 'lodash-es/groupBy';

import { KnownProviderCategories, PaymentMethod, PaymentMethodName } from 'checkout/state';
import { ServiceProvider } from 'checkout/backend';
import { logUnavailableWithConfig } from './log-unavailable-with-config';
import { assertUnreachable } from 'checkout/utils';

type InitConfigChunk = {
    onlineBanking: boolean;
    netBanking: boolean;
    upi: boolean;
    paymentFlowHold: boolean;
    recurring: boolean;
};

const categoryReducer = ({ onlineBanking, netBanking, upi }: Partial<InitConfigChunk>) => (
    result: PaymentMethod[],
    [category, serviceProviders]: [KnownProviderCategories, ServiceProvider[]]
) => {
    let paymentMethod = {
        name: PaymentMethodName.PaymentTerminal,
        category,
        serviceProviders
    };
    switch (category) {
        case KnownProviderCategories.OnlineBanking:
            if (onlineBanking) {
                result = result.concat([paymentMethod]);
            }
            break;
        case KnownProviderCategories.NetBanking:
            if (netBanking) {
                result = result.concat([paymentMethod]);
            }
            break;
        case KnownProviderCategories.UPI:
            if (upi) {
                result = result.concat([paymentMethod]);
            }
            break;
        default:
            assertUnreachable(category);
    }
    return result;
};

export const getTerminalsPaymentMethods = (
    serviceProviders: ServiceProvider[],
    { paymentFlowHold, recurring, onlineBanking, netBanking, upi }: InitConfigChunk
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
    return groupedByCategory.reduce(categoryReducer({ onlineBanking, netBanking, upi }), []);
};
