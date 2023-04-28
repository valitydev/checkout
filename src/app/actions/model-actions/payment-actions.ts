import { AbstractAction, TypeKeys } from 'checkout/actions';
import { PayableFormValues } from 'checkout/state';
import { AppConfig, LogicError } from 'checkout/backend';
import { InitConfig } from 'checkout/config';
import { Model } from 'checkout/hooks/fetch-model';
import { AmountInfo } from 'checkout/hooks/amount-info';
import { PaymentMethodName } from 'checkout/hooks/init-available-payment-methods';

export type AppContext = {
    initConfig: InitConfig;
    appConfig: AppConfig;
    origin: string;
    amountInfo: AmountInfo;
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
