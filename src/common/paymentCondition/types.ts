type UserInteraction = { [key: string]: any }; // Replace with a more specific type

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

type PollingTimeoutException = {
    type: 'pollingTimeout';
};

type PaymentProcessException = PollingTimeoutException;

export type PaymentProcessFailed = {
    name: 'paymentProcessFailed';
    exception: PaymentProcessException;
};

export type PaymentInteractionRequested = {
    name: 'interactionRequested';
    interaction: UserInteraction;
};

export type PaymentCondition =
    | PaymentUninitialized
    | PaymentPending
    | PaymentProcessed
    | PaymentFailed
    | PaymentInteractionRequested
    | PaymentProcessFailed;
