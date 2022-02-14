import { PaymentMethod, PaymentMethodName } from './payment-method';

export class DigitalWallet extends PaymentMethod {
    method: PaymentMethodName.DigitalWallet;
    providers: string[];
}
