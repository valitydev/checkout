import { PayableFormValues } from 'checkout/state';

export interface UPIFormValues extends PayableFormValues {
    provider: string;
    payerVirtualAddress: string;
}
