import { UserInteraction } from 'checkout/backend';

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

export type PaymentInteractionType = 'frame' | 'self';

export type PaymentInteractionRequested = {
    name: 'interactionRequested';
    type: PaymentInteractionType;
    interaction: UserInteraction;
};

export type PaymentCondition =
    | PaymentUninitialized
    | PaymentPending
    | PaymentProcessed
    | PaymentFailed
    | PaymentInteractionRequested
    | PaymentProcessFailed;
