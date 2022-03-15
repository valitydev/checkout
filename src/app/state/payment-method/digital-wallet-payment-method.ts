import { KnownDigitalWalletProviders } from './known-digital-wallet-providers';
import { PaymentMethod } from './payment-method';

export interface DigitalWalletPaymentMethod extends PaymentMethod {
    providers: KnownDigitalWalletProviders[];
}
