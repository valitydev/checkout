import { PaymentMethodName, PaymentTerminal, ServiceProvider } from 'checkout/backend';

import { BackendModel } from './getBackendModel';
import { PaymentMethod } from './types';

const fromPaymentTerminal = (terminalProviderIDs: string[], serviceProviders: ServiceProvider[]): PaymentMethod[] => {
    return [];
};

export const backendModelToPaymentMethods = (model: BackendModel): PaymentMethod[] => {
    return model.paymentMethods.reduce((result, backendPaymentMethod) => {
        switch (backendPaymentMethod.method) {
            case PaymentMethodName.BankCard:
                return result.concat([{ name: 'BankCard' }]);
            case PaymentMethodName.PaymentTerminal:
                const terminal = backendPaymentMethod as PaymentTerminal;
                return result.concat(fromPaymentTerminal(terminal.providers, model.serviceProviders));
        }
    }, []);
};
