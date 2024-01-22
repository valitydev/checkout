type Metadata = { [key: string]: any }; // Replace with a more specific type
type UserInteraction = { [key: string]: any }; // Replace with a more specific type

type PaymentAmount = {
    value: number;
    currency: string;
    locale: string;
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

type PaymentMethod = PaymentTerminal | BankCard;

type InvoiceContext = {
    type: 'invoice';
    invoiceID: string;
    invoiceAccessToken: string;
};

type InvoiceTemplateContext = {
    type: 'invoiceTemplate';
    invoiceTemplateID: string;
    invoiceTemplateAccessToken: string;
};

type PaymentCreationContext = {
    invoiceContext: InvoiceContext | InvoiceTemplateContext;
    terminalFormValues?: object;
    paymentMetadata?: object;
    contactInfo?: {
        email?: string;
        phoneNumber?: string;
    };
    isExternalIDIncluded: boolean;
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

type PaymentState =
    | PaymentUninitialized
    | PaymentPending
    | PaymentProcessed
    | PaymentFailed
    | PaymentInteractionRequested;

export type PaymentModel = {
    paymentState: PaymentState;
    availablePaymentMethods: PaymentMethod[];
    paymentCreationContext: PaymentCreationContext;
    paymentAmount: PaymentAmount;
};
