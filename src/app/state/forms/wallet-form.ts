import { PayableFormValues } from 'checkout/state';

export interface WalletFormValues extends PayableFormValues {
    provider: string;
    id: string;
    token?: string;
}
