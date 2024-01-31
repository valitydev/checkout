import { BrowserRequest, InvoiceStatuses, PaymentError, PaymentStatuses } from 'checkout/backend';

export type PaymentUninitialized = {
    name: 'uninitialized';
};

export type PaymentPending = {
    name: 'pending';
};

export type PaymentStarted = {
    name: 'paymentStarted';
};

export type PaymentStatusChanged = {
    name: 'paymentStatusChanged';
    status: PaymentStatuses;
    error?: PaymentError;
};

export type InvoiceStatusChanged = {
    name: 'invoiceStatusChanged';
    status: InvoiceStatuses;
};

export type PollingTimeoutException = {
    type: 'PollingTimeoutException';
};

export type ApiCallException = {
    type: 'ApiCallException';
};

type PaymentProcessException = PollingTimeoutException | ApiCallException;

export type PaymentProcessFailed = {
    name: 'paymentProcessFailed';
    exception: PaymentProcessException;
};

export type PaymentInteractionRedirectType = 'frame' | 'self';

export type PaymentInteractionRedirect = {
    type: 'PaymentInteractionRedirect';
    request: BrowserRequest;
};

export type PaymentInteractionQRCode = {
    type: 'PaymentInteractionQRCode';
    qrCode: string;
};

export type PaymentInteractionApiExtension = {
    type: 'PaymentInteractionApiExtension';
};

export type Interaction = PaymentInteractionRedirect | PaymentInteractionQRCode | PaymentInteractionApiExtension;

export type PaymentInteractionRequested = {
    name: 'interactionRequested';
    interaction: Interaction;
    provider?: string;
};

export type PaymentCondition =
    | PaymentUninitialized
    | PaymentPending
    | PaymentStatusChanged
    | InvoiceStatusChanged
    | PaymentInteractionRequested
    | PaymentProcessFailed
    | PaymentStarted;
