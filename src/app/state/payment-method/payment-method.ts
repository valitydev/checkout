import { PaymentMethodName } from './payment-method-name';

export interface PaymentMethod {
    name: PaymentMethodName;
    priority?: number;
}

export enum KnownDigitalWalletProviders {
    Sticpay = 'Sticpay',
    Venuspoint = 'Venuspoint'
}

export interface DigitalWalletPaymentMethod extends PaymentMethod {
    providers: KnownDigitalWalletProviders[];
}
