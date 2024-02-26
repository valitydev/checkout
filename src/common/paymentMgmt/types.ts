export type ContactInfoValues = {
    email?: string;
    phoneNumber?: string;
};

export type TerminalValuesMetadata = Record<string, any>;

export type TerminalValues = {
    provider: string;
    metadata?: TerminalValuesMetadata;
    contactInfo?: ContactInfoValues;
};

export type StartPaymentTerminalPayload = {
    methodName: 'PaymentTerminal';
    values: TerminalValues;
};

export type BankCardValues = {
    cardNumber: string;
    secureCode: string;
    expireDate?: string;
    cardHolder?: string;
    contactInfo?: ContactInfoValues;
};

export type StartPaymentBankCardPayload = {
    methodName: 'BankCard';
    values: BankCardValues;
};

export type StartPaymentPayload = StartPaymentBankCardPayload | StartPaymentTerminalPayload;
