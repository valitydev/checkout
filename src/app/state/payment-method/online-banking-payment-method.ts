import { PaymentMethod } from './payment-method';
import { PaymentMethodName } from './payment-method-name';
import { ServiceProvider } from 'checkout/backend';

export interface OnlineBankingPaymentMethod extends PaymentMethod {
    name: PaymentMethodName.OnlineBanking;
    serviceProviders: ServiceProvider[];
}
