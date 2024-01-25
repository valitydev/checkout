type Metadata = { [key: string]: any }; // Replace with a more specific type
type UserInteraction = { [key: string]: any }; // Replace with a more specific type

export type PaymentAmount = {
    value: number;
    currency: string;
};

type PaymentTerminal = {
    name: 'PaymentTerminal';
    id: string;
    category: string;
    metadata: Metadata;
};

type BankCard = {
    name: 'BankCard';
};

export type PaymentMethod = PaymentTerminal | BankCard;

export type InvoiceContext = {
    type: 'InvoiceContext';
    invoiceID: string;
    invoiceAccessToken: string;
};

export type InvoiceTemplateContext = {
    type: 'InvoiceTemplateContext';
    invoiceTemplateID: string;
    invoiceTemplateAccessToken: string;
};

export type InitContextContactInfo = {
    email?: string;
    phoneNumber?: string;
};

export type InitContext = {
    readonly apiEndpoint: string;
    readonly invoiceContext: InvoiceContext | InvoiceTemplateContext;
    readonly contactInfo?: InitContextContactInfo;
    readonly terminalFormValues?: object;
    readonly paymentMetadata?: object;
    readonly isExternalIDIncluded?: boolean;
};

type PaymentUninitialized = {
    name: 'uninitialized';
};

type PaymentPending = {
    name: 'pending';
};

type PaymentProcessed = {
    name: 'processed';
};

type PaymentError = { message: string; code: number /* other relevant fields */ };

type PaymentFailed = {
    name: 'failed';
    error: PaymentError;
};

type PaymentInteractionRequested = {
    name: 'interactionRequested';
    interaction: UserInteraction;
};

export type PaymentState =
    | PaymentUninitialized
    | PaymentPending
    | PaymentProcessed
    | PaymentFailed
    | PaymentInteractionRequested;

export type PaymentModel = {
    readonly initContext: InitContext;
    readonly paymentMethods: PaymentMethod[];
    readonly paymentAmount: PaymentAmount;

    paymentState: PaymentState;
};

export type CommonStartPaymentPayload = {
    email?: string;
    phoneNumber?: string;
};

export type StartPaymentBankCardPayload = {
    methodName: 'BankCard';
    cardNumber: string;
    expireDate: string;
    secureCode: string;
    cardHolder?: string;
} & CommonStartPaymentPayload;

export type StartPaymentTerminalPayload = {
    methodName: 'PaymentTerminal';
} & CommonStartPaymentPayload;

export type StartPaymentPayload = StartPaymentBankCardPayload | StartPaymentTerminalPayload;
