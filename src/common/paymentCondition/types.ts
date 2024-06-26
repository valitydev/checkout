import { BrowserRequest, InvoiceStatus, PaymentError, PaymentStatus } from '../backend/payments';
import { InvoiceContext } from '../paymentModel';

export type InvoiceDetermined = {
    name: 'invoiceDetermined';
    invoiceContext: InvoiceContext;
};

export type PaymentProcessStarted = {
    name: 'paymentProcessStarted';
};

export type ApiCallException = any;

export type PaymentProcessFailed = {
    name: 'paymentProcessFailed';
    exception: ApiCallException;
};

export type PaymentStarted = {
    name: 'paymentStarted';
    eventId: number;
    paymentId: string;
    provider?: string;
    externalId?: string;
    isInstantPayment: boolean;
};

export type PaymentStatusChanged = {
    name: 'paymentStatusChanged';
    eventId: number;
    paymentId: string;
    status: PaymentStatus;
    error?: PaymentError;
};

export type PaymentStatusUnknown = {
    name: 'paymentStatusUnknown';
};

export type InvoiceStatusChanged = {
    name: 'invoiceStatusChanged';
    status: InvoiceStatus;
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
    paymentId: string;
    interaction: Interaction;
    eventId: number;
};

export type PaymentInteractionCompleted = {
    name: 'interactionCompleted';
    paymentId: string;
    eventId: number;
};

export type PaymentCondition =
    | InvoiceDetermined
    | PaymentProcessStarted
    | PaymentProcessFailed
    | PaymentStarted
    | PaymentStatusUnknown
    | PaymentStatusChanged
    | InvoiceStatusChanged
    | PaymentInteractionRequested
    | PaymentInteractionCompleted;
