import {
    getServiceProviderByID,
    PaymentMethod,
    PaymentMethodName,
    PaymentTerminal,
    ServiceProvider
} from 'checkout/backend';
import { all, call } from 'redux-saga/effects';
import { logPrefix } from 'checkout/log-messages';

export function* getServiceProviderByIDAndLog(endpoint: string, accessToken: string, id: string) {
    try {
        return yield call(getServiceProviderByID, endpoint, accessToken, id);
    } catch (err) {
        console.error(`${logPrefix} Failed to load provider "${id}".`, err);
        return null;
    }
}

export function* getServiceProviders(paymentMethods: PaymentMethod[], endpoint: string, accessToken: string) {
    const paymentTerminal = paymentMethods.find(
        (m) => m.method === PaymentMethodName.PaymentTerminal
    ) as PaymentTerminal;
    if (!paymentTerminal) {
        return [];
    }
    const serviceProviders: ServiceProvider[] = (yield all(
        paymentTerminal.providers.map((id) => call(getServiceProviderByIDAndLog, endpoint, accessToken, id))
    )).filter((p) => !!p);
    return serviceProviders;
}
