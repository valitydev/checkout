import { PayableFormValues } from 'checkout/state';
import { KnownDigitalWalletProviders } from '../payment-method';

export interface WalletFormValues extends PayableFormValues {
    provider: KnownDigitalWalletProviders;
}

export interface SticpayWalletFormValues extends WalletFormValues {
    sticpayAccount: string;
}
