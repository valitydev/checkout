import { PayableFormValues } from './payable-form-values';

export interface WalletFormValues extends PayableFormValues {
    provider: string;
    id: string;
    token?: string;
}
