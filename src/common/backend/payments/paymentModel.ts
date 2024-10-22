import { ServiceProviderMetadata } from './serviceProviderMetadata';

export type InvoiceAmountRandomized = {
    original: number;
    randomized: number;
};

export type ClientInfo = {
    fingerprint: string;
    ip?: string;
    url?: string;
};

export type PaymentResource = {
    paymentToolToken: string;
    paymentSession: string;
    paymentToolDetails: PaymentToolDetails;
    clientInfo: ClientInfo;
};

export type PaymentError = {
    code: string;
    subError?: PaymentError;
};

export type PaymentFlowInstant = {
    type: 'PaymentFlowInstant';
};

export type PaymentFlowHold = {
    type: 'PaymentFlowHold';
    onHoldExpiration: 'cancel' | 'capture';
};

export type PaymentFlow = PaymentFlowInstant | PaymentFlowHold;

export type ContactInfo = {
    email: string;
    phoneNumber: string;
};

export type PaymentToolDetailsBankCard = {
    detailsType: 'PaymentToolDetailsBankCard';
    cardNumberMask: string;
    first6: string;
    last4: string;
    paymentSystem: string;
};

export type PaymentToolDetailsPaymentTerminal = {
    detailsType: 'PaymentToolDetailsPaymentTerminal';
    provider: string;
};

export type PaymentToolDetails = PaymentToolDetailsBankCard | PaymentToolDetailsPaymentTerminal;

export type PaymentResourcePayer = {
    payerType: 'PaymentResourcePayer';
    contactInfo: Partial<ContactInfo>;
    paymentToolToken?: string;
    paymentSession?: string;
    sessionInfo?: {
        redirectUrl: string;
    };
    paymentToolDetails?: PaymentToolDetails;
};

export type Payer = PaymentResourcePayer;

export type Payment = {
    id: string;
    invoiceID: string;
    createdAt: string;
    amount: number;
    currency: string;
    flow: PaymentFlow;
    payer: Payer;
    status: PaymentStatus;
    error: PaymentError;
    externalID: string;
};

export type PaymentStatus = 'processed' | 'failed' | 'cancelled' | 'pending' | 'captured' | 'refunded';

export type UserInteractionForm = {
    key: string;
    template: string;
};

export type BrowserGetRequest = {
    requestType: 'BrowserGetRequest';
    uriTemplate: string;
};

export type BrowserPostRequest = {
    requestType: 'BrowserPostRequest';
    uriTemplate: string;
    form: UserInteractionForm[];
};

export type BrowserRequest = BrowserGetRequest | BrowserPostRequest;

export type ApiExtensionRequest = {
    interactionType: 'ApiExtensionRequest';
    apiType: string;
};

export type QrCodeDisplayRequest = {
    interactionType: 'QrCodeDisplayRequest';
    qrCode: string;
};

export type Redirect = {
    interactionType: 'Redirect';
    request: BrowserRequest;
};

export type UserInteraction = ApiExtensionRequest | QrCodeDisplayRequest | Redirect;

export type PaymentInteractionRequested = {
    changeType: 'PaymentInteractionRequested';
    paymentID: string;
    userInteraction: UserInteraction;
};

export type PaymentInteractionCompleted = {
    changeType: 'PaymentInteractionCompleted';
    paymentID: string;
    userInteraction?: UserInteraction;
};

export type PaymentStatusChanged = {
    changeType: 'PaymentStatusChanged';
    status: PaymentStatus;
    paymentID: string;
    error?: PaymentError;
};

export type PaymentStarted = {
    changeType: 'PaymentStarted';
    payment: Payment;
};

export type InvoiceStatusChanged = {
    changeType: 'InvoiceStatusChanged';
    status: InvoiceStatus;
    reason?: string;
};

export type InvoiceCreated = {
    changeType: 'InvoiceCreated';
    invoice: Invoice;
};

export type InvoiceChangeType =
    | 'InvoiceCreated'
    | 'InvoiceStatusChanged'
    | 'PaymentStatusChanged'
    | 'PaymentStarted'
    | 'PaymentInteractionRequested'
    | 'PaymentInteractionCompleted';

export type InvoiceChange =
    | InvoiceCreated
    | InvoiceStatusChanged
    | PaymentStatusChanged
    | PaymentStarted
    | PaymentInteractionRequested
    | PaymentInteractionCompleted;

export type InvoiceEvent = {
    id: number;
    createdAt: string;
    changes: InvoiceChange[];
};

type LifetimeInterval = {
    days: number;
    months: number;
    years: number;
};

type InvoiceLine = {
    product: string;
    quantity: number;
    price: number;
    cost: number;
};

type CostAmountRange = {
    lowerBound: number;
    upperBound: number;
};

export type InvoiceTemplateLineCostUnlim = {
    costType: 'InvoiceTemplateLineCostUnlim';
};

export type InvoiceTemplateLineCostRange = {
    costType: 'InvoiceTemplateLineCostRange';
    range: CostAmountRange;
    currency: string;
};

export type InvoiceTemplateLineCostFixed = {
    costType: 'InvoiceTemplateLineCostFixed';
    amount: number;
    currency: string;
};

export type InvoiceTemplateSingleLine = {
    templateType: 'InvoiceTemplateSingleLine';
    product: string;
    price: InvoiceTemplateLineCostFixed | InvoiceTemplateLineCostRange | InvoiceTemplateLineCostUnlim;
};

export type InvoiceTemplateMultiLine = {
    templateType: 'InvoiceTemplateMultiLine';
    cart: InvoiceLine[];
    currency: string;
};

export type InvoiceTemplate = {
    id: string;
    shopID: string;
    product: string;
    description: string;
    lifetime: LifetimeInterval;
    details: InvoiceTemplateMultiLine | InvoiceTemplateSingleLine;
    metadata: object;
    externalID?: string;
};

export type ServiceProvider = {
    id: string;
    brandName: string;
    category: string;
    metadata?: ServiceProviderMetadata;
};

export type PaymentTerminal = {
    method: 'PaymentTerminal';
    providers: string[];
};

export type DigitalWallet = {
    method: 'DigitalWallet';
    providers: string[];
};

export type BankCard = {
    method: 'BankCard';
    paymentSystems: string[];
};

export type PaymentMethod = PaymentTerminal | BankCard | DigitalWallet;

export type InvoiceStatus = 'unpaid' | 'cancelled' | 'paid' | 'fulfilled';

export type InvoiceAndToken = {
    invoice: Invoice;
    invoiceAccessToken: {
        payload: string;
    };
};

export type Invoice = {
    id: string;
    shopID: string;
    invoiceTemplateID: string;
    createdAt: string;
    dueDate: string;
    amount: number;
    currency: string;
    metadata: object;
    product: string;
    description: string;
    status: InvoiceStatus;
    reason: string;
    cart: InvoiceLine[];
    externalID?: string;
    amountRandomized?: InvoiceAmountRandomized;
};
