import { PaymentSessionInfoMetadata } from 'checkout/backend';
import { PayableFormValues } from 'checkout/state';

export interface PaymentTerminalFormValues extends PayableFormValues {
    provider: string;
    paymentSessionInfo?: PaymentSessionInfoMetadata;
    metadata?: any;
}
