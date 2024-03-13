import { BackendModel } from './getBackendModel';
import { KnownProviderCategory, PaymentMethod } from './types';
import { ServiceProvider } from '../backend/payments';
import { assertUnreachable, groupBy } from '../utils';

const categoryReducer = (
    result: PaymentMethod[],
    [category, serviceProviders]: [KnownProviderCategory, ServiceProvider[]],
) => {
    const paymentMethod: PaymentMethod = {
        methodName: 'PaymentTerminal',
        category,
        providers: serviceProviders.map(({ id }) => id),
    };
    switch (category) {
        case 'onlinebanking':
        case 'digitalwallet':
        case 'netbanking':
        case 'paymentterminal':
        case 'pix':
        case 'upi':
            result = result.concat([paymentMethod]);
            break;
        default:
            assertUnreachable(category);
    }
    return result;
};

const findByID =
    ({ id }: ServiceProvider) =>
    (providerID: string) =>
        providerID === id;

export const filterByPaymentMethodProviders =
    (paymentMethodProviderIDs: string[]) => (serviceProvider: ServiceProvider) =>
        paymentMethodProviderIDs.find(findByID(serviceProvider));

const fromPaymentTerminal = (terminalProviderIDs: string[], serviceProviders: ServiceProvider[]): PaymentMethod[] => {
    const filtered = serviceProviders.filter(filterByPaymentMethodProviders(terminalProviderIDs));
    const groupedByCategory = Object.entries(groupBy(filtered, 'category'));
    const result = groupedByCategory.reduce(categoryReducer, []);
    return result;
};

export const backendModelToPaymentMethods = (model: BackendModel): PaymentMethod[] => {
    return model.paymentMethods.reduce((result, backendPaymentMethod) => {
        switch (backendPaymentMethod.method) {
            case 'BankCard':
                return result.concat([{ methodName: 'BankCard' }]);
            case 'PaymentTerminal':
                return result.concat(fromPaymentTerminal(backendPaymentMethod.providers, model.serviceProviders));
            default:
                return result;
        }
    }, []);
};
