import { BrowserRequest } from 'checkout/backend';

export type PaymentUninitialized = {
    name: 'uninitialized';
};

export type PaymentPending = {
    name: 'pending';
};

export type PaymentProcessedStatus = 'InvoicePaid' | 'InvoiceFulfilled' | 'PaymentCaptured';

export type PaymentProcessed = {
    name: 'processed';
    status: PaymentProcessedStatus;
};

export type PaymentError = {
    code: string;
    subError?: PaymentError;
};

export type PaymentFailed = {
    name: 'paymentFailed';
    error: PaymentError;
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
    | PaymentProcessed
    | PaymentFailed
    | PaymentInteractionRequested
    | PaymentProcessFailed;
