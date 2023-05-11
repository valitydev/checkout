import { ServiceProvider } from 'checkout/backend';
import { PaymentMethod } from './payment-method';

export interface DigitalWalletPaymentMethod extends PaymentMethod {
    serviceProviders: ServiceProvider[];
}
