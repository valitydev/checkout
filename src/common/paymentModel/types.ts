type Metadata = { [key: string]: any }; // Replace with a more specific type

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

export type InitContextContactInfo = {
    email?: string;
    phoneNumber?: string;
};

export type InitContext = {
    readonly contactInfo?: InitContextContactInfo;
    readonly terminalFormValues?: object;
    readonly paymentMetadata?: object;
    readonly isExternalIDIncluded?: boolean;
};

export type CommonPaymentModel = {
    readonly apiEndpoint: string;
    readonly initContext: InitContext;
    readonly paymentMethods: PaymentMethod[];
    readonly paymentAmount: PaymentAmount;
};

export type InvoiceTemplateParams = {
    invoiceTemplateID: string;
    invoiceTemplateAccessToken: string;
};

export type InvoiceParams = {
    invoiceID: string;
    invoiceAccessToken: string;
};

export type InvoiceTemplateContext = {
    readonly type: 'InvoiceTemplateContext';
    readonly invoiceTemplateParams: InvoiceTemplateParams;
};

export type InvoiceContext = {
    readonly type: 'InvoiceContext';
    readonly invoiceParams: InvoiceParams;
};

export type PaymentModelInvoice = InvoiceContext & CommonPaymentModel;
export type PaymentModelInvoiceTemplate = InvoiceTemplateContext & CommonPaymentModel;
export type PaymentModel = PaymentModelInvoice | PaymentModelInvoiceTemplate;

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
