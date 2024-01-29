import { ServiceProviderMetadata } from 'checkout/backend';

export type PaymentAmount = {
    value: number;
    currency: string;
};

export type KnownProviderCategory =
    | 'onlinebanking'
    | 'netbanking'
    | 'upi'
    | 'digitalwallet'
    | 'pix'
    | 'paymentterminal';

export type TerminalServiceProvider = {
    id: string;
    metadata?: ServiceProviderMetadata;
};

export type PaymentTerminal = {
    name: 'PaymentTerminal';
    category: KnownProviderCategory;
    providers: TerminalServiceProvider[];
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
    readonly redirectUrl?: string;
    readonly metadata?: object;
};

export type CommonPaymentModel = {
    readonly apiEndpoint: string;
    readonly urlShortenerEndpoint: string;
    readonly origin: string;
    readonly localeCode: string;
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
    readonly metadata: object;
};

export type InvoiceContext = {
    readonly type: 'InvoiceContext';
    readonly invoiceParams: InvoiceParams;
    readonly dueDate: string;
    readonly externalID: string;
};

export type PaymentModelInvoice = InvoiceContext & CommonPaymentModel;
export type PaymentModelInvoiceTemplate = InvoiceTemplateContext & CommonPaymentModel;
export type PaymentModel = PaymentModelInvoice | PaymentModelInvoiceTemplate;
