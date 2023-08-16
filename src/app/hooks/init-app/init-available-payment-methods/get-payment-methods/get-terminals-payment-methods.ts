import { PaymentTerminal, ServiceProvider } from 'checkout/backend';
import { assertUnreachable } from 'checkout/utils';
import groupBy from 'checkout/utils/group-by';

import { filterByPaymentMethodProviders } from './filter-by-payment-method-providers';
import { KnownProviderCategories, PaymentMethod, PaymentMethodName } from '../types';

interface InitConfigChunk {
    onlineBanking: boolean;
    netBanking: boolean;
    upi: boolean;
    terminalWallets: boolean;
    pix: boolean;
    paymentFlowHold: boolean;
    recurring: boolean;
}

const categoryReducer =
    ({ onlineBanking, netBanking, upi, terminalWallets, pix }: Partial<InitConfigChunk>) =>
    (result: PaymentMethod[], [category, serviceProviders]: [KnownProviderCategories, ServiceProvider[]]) => {
        const paymentMethod = {
            name: PaymentMethodName.PaymentTerminal,
            category,
            serviceProviders,
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
            case KnownProviderCategories.DigitalWallet:
                if (terminalWallets) {
                    result = result.concat([paymentMethod]);
                }
                break;
            case KnownProviderCategories.PIX:
                if (pix) {
                    result = result.concat([paymentMethod]);
                }
                break;
            case KnownProviderCategories.PaymentTerminal:
                result = result.concat([paymentMethod]);
                break;
            default:
                assertUnreachable(category);
        }
        return result;
    };

export const getTerminalsPaymentMethods = (
    { providers }: PaymentTerminal,
    serviceProviders: ServiceProvider[],
    { paymentFlowHold, recurring, onlineBanking, netBanking, upi, terminalWallets, pix }: InitConfigChunk,
): PaymentMethod[] => {
    if (paymentFlowHold) {
        return [];
    }
    if (recurring) {
        return [];
    }
    const filtered = serviceProviders.filter(filterByPaymentMethodProviders(providers));
    const groupedByCategory = Object.entries(groupBy(filtered, 'category'));
    return groupedByCategory.reduce(
        categoryReducer({
            onlineBanking,
            netBanking,
            upi,
            terminalWallets,
            pix,
        }),
        [],
    );
};
