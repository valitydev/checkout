import { PaymentSessionInfoMetadata } from 'checkout/backend';
import { PayableFormValues } from './payable-form-values';

export interface PaymentTerminalFormValues extends PayableFormValues {
    provider: string;
    paymentSessionInfo?: PaymentSessionInfoMetadata;
    metadata?: any;
}
