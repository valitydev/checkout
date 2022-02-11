import { PaymentMethodName } from './payment-method-name';

export interface PaymentMethod {
    name: PaymentMethodName;
    priority?: number;
}

export enum KnownDigitalWalletProviders {
    sticpay = 'sticpay'
}

export interface DigitalWalletPaymentMethod extends PaymentMethod {
    providers: KnownDigitalWalletProviders[];
}
