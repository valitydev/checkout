import { PayableFormValues } from 'checkout/state';

export interface PaymentTerminalFormValues extends PayableFormValues {
    provider: string;
    metadata?: any;
}
