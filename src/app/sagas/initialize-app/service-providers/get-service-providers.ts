import {
    getServiceProviderByID,
    PaymentMethod,
    PaymentMethodName,
    PaymentTerminal,
    ServiceProvider
} from 'checkout/backend';
import { all, call } from 'redux-saga/effects';
import { assertMetadata } from 'checkout/sagas/initialize-app/service-providers/assert-metadata';

export function* getServiceProviders(paymentMethods: PaymentMethod[], endpoint: string, accessToken: string) {
    const paymentTerminal = paymentMethods.find(
        (m) => m.method === PaymentMethodName.PaymentTerminal
    ) as PaymentTerminal;
    if (!paymentTerminal) {
        return [];
    }
    const serviceProviders: ServiceProvider[] = yield all(
        paymentTerminal.providers.map((id) => call(getServiceProviderByID, endpoint, accessToken, id))
    );
    serviceProviders.forEach((serviceProvider) => assertMetadata(serviceProvider.id, serviceProvider.metadata));
    return serviceProviders;
}
