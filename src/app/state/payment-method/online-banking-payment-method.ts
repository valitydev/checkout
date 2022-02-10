import { PaymentMethod } from './payment-method';
import { PaymentMethodName } from './payment-method-name';
import { ServiceProvider } from 'checkout/api-codegen/payments';

export class OnlineBankingPaymentMethod extends PaymentMethod {
    name = PaymentMethodName.OnlineBanking;
    serviceProviders: ServiceProvider[];
}
