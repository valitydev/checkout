import {
    getServiceProviderByID,
    PaymentMethod,
    PaymentMethodName,
    PaymentTerminal,
    ServiceProvider
} from 'checkout/backend';
import { logPrefix } from 'checkout/log-messages';

export async function getServiceProviderOrNull(
    endpoint: string,
    accessToken: string,
    id: string
): Promise<ServiceProvider | null> {
    try {
        return await getServiceProviderByID(endpoint, accessToken, id);
    } catch (err) {
        console.error(`${logPrefix} Failed to load provider "${id}".`, err);
        return null;
    }
}

const providerIDsReducer = (result: string[], method: PaymentMethod): string[] => {
    switch (method.method) {
        case PaymentMethodName.PaymentTerminal:
        case PaymentMethodName.DigitalWallet:
            return result.concat((method as PaymentTerminal).providers);
    }
    return result;
};

export async function getServiceProviders(
    paymentMethods: PaymentMethod[],
    endpoint: string,
    accessToken: string
): Promise<ServiceProvider[]> {
    const providerIDs = paymentMethods.reduce(providerIDsReducer, []);
    const serviceProvidersOrNull = await Promise.all(
        providerIDs.map((id) => getServiceProviderOrNull(endpoint, accessToken, id))
    );
    return serviceProvidersOrNull.filter((provider) => provider !== null);
}
