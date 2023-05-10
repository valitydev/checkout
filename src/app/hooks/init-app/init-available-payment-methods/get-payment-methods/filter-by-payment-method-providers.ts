import { ServiceProvider } from 'checkout/backend';

const findByID = ({ id }: ServiceProvider) => (providerID: string) => providerID === id;

export const filterByPaymentMethodProviders = (paymentMethodProviderIDs: string[]) => (
    serviceProvider: ServiceProvider
) => paymentMethodProviderIDs.find(findByID(serviceProvider));
