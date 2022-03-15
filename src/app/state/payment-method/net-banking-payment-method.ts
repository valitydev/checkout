import { PaymentMethod } from './payment-method';
import { PaymentMethodName } from './payment-method-name';
import { ServiceProvider } from 'checkout/backend';

export interface NetBankingPaymentMethod extends PaymentMethod {
    name: PaymentMethodName.NetBanking;
    serviceProviders: ServiceProvider[];
}
