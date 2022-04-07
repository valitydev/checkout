import { ServiceProvider } from 'checkout/backend';
import { State } from 'checkout/state';

export const getServiceProviderSelector = (serviceProviderID: string) => (s: State): ServiceProvider =>
    s.model.serviceProviders.find((serviceProvider) => serviceProvider.id === serviceProviderID);
