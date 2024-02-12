import {
    getServiceProviderByID,
    PaymentMethod,
    PaymentMethodName,
    PaymentTerminal,
    ServiceProvider,
} from 'checkout/backend';

import { isNil } from '../utils';

export async function getServiceProviderOrNull(
    endpoint: string,
    accessToken: string,
    id: string,
): Promise<ServiceProvider | null> {
    try {
        return await getServiceProviderByID(endpoint, accessToken, id);
    } catch (err) {
        console.error(`Failed to load provider "${id}".`, err);
        return null;
    }
}

const providerIDsReducer = (result: string[], method: PaymentMethod): string[] => {
    switch (method.method) {
        case PaymentMethodName.PaymentTerminal:
        case PaymentMethodName.DigitalWallet:
            const terminalMethod = method as PaymentTerminal;
            if (!isNil(terminalMethod.providers)) {
                return result.concat(terminalMethod.providers);
            }
            return result;
        default:
            return result;
    }
};

export const getServiceProviders = async (
    paymentMethods: PaymentMethod[],
    endpoint: string,
    accessToken: string,
): Promise<ServiceProvider[]> => {
    const providerIDs = paymentMethods.reduce(providerIDsReducer, []);
    const serviceProvidersOrNull = await Promise.all(
        providerIDs.map((id) => getServiceProviderOrNull(endpoint, accessToken, id)),
    );
    return serviceProvidersOrNull.filter((provider): provider is ServiceProvider => !isNil(provider));
};
