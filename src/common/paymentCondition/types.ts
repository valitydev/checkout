type UserInteraction = { [key: string]: any }; // Replace with a more specific type

export type PaymentUninitialized = {
    name: 'uninitialized';
};

export type PaymentPending = {
    name: 'pending';
};

export type PaymentProcessed = {
    name: 'processed';
};

type PaymentError = { message: string; code: number /* other relevant fields */ };

export type PaymentFailed = {
    name: 'failed';
    error: PaymentError;
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
    | PaymentInteractionRequested;
