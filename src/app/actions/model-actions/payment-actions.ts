import { AbstractAction, TypeKeys } from 'checkout/actions';
import { AmountInfoState, PayableFormValues, PaymentMethodName } from 'checkout/state';
import { AppConfig, LogicError } from 'checkout/backend';
import { InitConfig } from 'checkout/config';
import { Model } from 'checkout/hooks/fetch-model';

export type AppContext = {
    initConfig: InitConfig;
    appConfig: AppConfig;
    origin: string;
    amountInfo: AmountInfoState;
    model: Model;
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
