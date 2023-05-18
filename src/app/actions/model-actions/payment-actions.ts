import { AbstractAction, TypeKeys } from 'checkout/actions';
import { PayableFormValues } from 'checkout/state';
import { AppConfig, LogicError, ServiceProvider } from 'checkout/backend';
import { InitConfig } from 'checkout/config';
import { PayableInvoiceData, PaymentMethodName } from 'checkout/hooks';

export type AppContext = {
    initConfig: InitConfig;
    appConfig: AppConfig;
    origin: string;
    serviceProviders: ServiceProvider[];
    payableInvoice: PayableInvoiceData;
};

export interface PaymentRequestedPayload {
    method: PaymentMethodName;
    context: AppContext;
    values?: PayableFormValues;
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
