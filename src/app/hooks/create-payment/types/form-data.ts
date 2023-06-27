import { PaymentMethodName, PaymentSessionInfoMetadata } from 'checkout/backend';

export interface WalletFormValues extends PayableFormValues {
    provider: string;
    id: string;
    token?: string;
}

export interface PaymentTerminalFormValues extends PayableFormValues {
    provider: string;
    paymentSessionInfo?: PaymentSessionInfoMetadata;
    metadata?: any;
}

export interface CardFormValues extends PayableFormValues {
    cardNumber?: string;
    expireDate?: string;
    secureCode?: string;
    cardHolder?: string;
}

export interface PayableFormValues {
    email?: string;
    phoneNumber?: string;
    amount?: string;
}

export type FormData = {
    method: PaymentMethodName;
    values?: PayableFormValues;
};
