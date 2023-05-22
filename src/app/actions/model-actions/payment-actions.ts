import { AbstractAction, TypeKeys } from 'checkout/actions';
import { LogicError, ServiceProvider } from 'checkout/backend';

export interface PaymentRequestedPayload {
    capiEndpoint: string;
    invoiceID: string;
    invoiceAccessToken: string;
    serviceProviders: ServiceProvider[];
}

export interface PaymentRequested extends AbstractAction<PaymentRequestedPayload> {
    type: TypeKeys.PAYMENT_REQUESTED;
    payload: PaymentRequestedPayload;
}

export interface PaymentCompleted extends AbstractAction {
    type: TypeKeys.PAYMENT_COMPLETED;
}

export interface PaymentFailed extends AbstractAction<LogicError> {
    type: TypeKeys.PAYMENT_FAILED;
    payload: LogicError;
}

export const pay = (payload: PaymentRequestedPayload): PaymentRequested => ({
    type: TypeKeys.PAYMENT_REQUESTED,
    payload
});
