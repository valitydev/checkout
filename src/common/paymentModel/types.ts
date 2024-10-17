import { InvoiceStatus, PaymentFlow, ServiceProviderMetadata } from '../backend/payments';

export type PaymentAmount = {
    readonly value: number;
    readonly currency: string;
};

export type KnownProviderCategory =
    | 'onlinebanking'
    | 'netbanking'
    | 'upi'
    | 'digitalwallet'
    | 'pix'
    | 'paymentterminal';

export type TerminalServiceProvider = {
    readonly id: string;
    readonly brandName: string;
    readonly metadata?: ServiceProviderMetadata;
};

export type PaymentMethodName = 'PaymentTerminal' | 'BankCard';

export type PaymentTerminal = {
    readonly methodName: 'PaymentTerminal';
    readonly category: KnownProviderCategory;
    readonly providers: string[];
};

export type BankCard = {
    readonly methodName: 'BankCard';
};

export type PaymentMethod = PaymentTerminal | BankCard;

export type InitContextContactInfo = {
    readonly email?: string;
    readonly phoneNumber?: string;
};

export type InitContext = {
    readonly skipUserInteraction: boolean;
    readonly paymentFlow: PaymentFlow;
    readonly contactInfo?: InitContextContactInfo;
    readonly terminalFormValues?: Record<string, any>;
    readonly paymentMetadata?: Record<string, any>;
    readonly isExternalIDIncluded?: boolean;
    readonly redirectUrl?: string;
    readonly cancelUrl?: string;
    readonly metadata?: Record<string, any>;
    readonly recurring?: boolean;
};

export type CommonPaymentModel = {
    readonly apiEndpoint: string;
    readonly urlShortenerEndpoint: string;
    readonly origin: string;
    readonly localeCode: string;
    readonly initContext: InitContext;
    readonly paymentMethods: PaymentMethod[];
    readonly paymentAmount: PaymentAmount;
    readonly serviceProviders?: TerminalServiceProvider[];
};

export type InvoiceTemplateParams = {
    readonly invoiceTemplateID: string;
    readonly invoiceTemplateAccessToken: string;
};

export type InvoiceParams = {
    readonly invoiceID: string;
    readonly invoiceAccessToken: string;
};

export type InvoiceTemplateContext = {
    readonly type: 'InvoiceTemplateContext';
    readonly invoiceTemplateParams: InvoiceTemplateParams;
    readonly metadata: object;
    readonly externalID?: string;
};

export type InvoiceContext = {
    readonly type: 'InvoiceContext';
    readonly invoiceParams: InvoiceParams;
    readonly dueDate: string;
    readonly status: InvoiceStatus;
    readonly externalID?: string;
    readonly isAmountRandomized: boolean;
};

export type PaymentModelInvoice = InvoiceContext & CommonPaymentModel;
export type PaymentModelInvoiceTemplate = InvoiceTemplateContext & CommonPaymentModel;
export type PaymentModel = PaymentModelInvoice | PaymentModelInvoiceTemplate;
