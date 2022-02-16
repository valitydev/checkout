import { PayableFormValues } from 'checkout/state';

export interface OnlineBankingAccountFormValues extends PayableFormValues {
    provider: string;
    metadata?: any;
}
