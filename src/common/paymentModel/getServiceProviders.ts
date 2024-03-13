import { PaymentMethod, ServiceProvider, getServiceProviderByID } from '../backend/payments';
import { isNil, withRetry } from '../utils';

const providerIDsReducer = (result: string[], method: PaymentMethod): string[] => {
    switch (method.method) {
        case 'PaymentTerminal':
        case 'DigitalWallet':
            if (!isNil(method.providers)) {
                return result.concat(method.providers);
            }
            return result;
        default:
            return result;
    }
};

const getServiceProviderByIDWithRetry = withRetry(getServiceProviderByID);

export const getServiceProviders = async (
    paymentMethods: PaymentMethod[],
    endpoint: string,
    accessToken: string,
): Promise<ServiceProvider[]> => {
    const providerIDs = paymentMethods.reduce(providerIDsReducer, []);
    const serviceProvidersOrNull = await Promise.all(
        providerIDs.map((id) => getServiceProviderByIDWithRetry(endpoint, accessToken, id)),
    );
    return serviceProvidersOrNull.filter((provider): provider is ServiceProvider => !isNil(provider));
};
