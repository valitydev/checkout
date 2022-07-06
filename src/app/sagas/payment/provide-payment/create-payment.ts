import { call, CallEffect } from 'redux-saga/effects';

import {
    PaymentResource,
    PaymentFlow,
    PayerType,
    createPayment as request,
    FlowType,
    PaymentFlowHold
} from 'checkout/backend';
import { Payment, PaymentFlowInstant } from 'checkout/backend/model';
import { InitConfig } from 'checkout/config';
import { PayableFormValues } from 'checkout/state';
import { replaceSpaces } from 'checkout/utils';

type Effects = CallEffect | Payment;

export const toPaymentFlow = (c: InitConfig): PaymentFlow => {
    const instant: PaymentFlowInstant = { type: FlowType.PaymentFlowInstant };
    const hold: PaymentFlowHold = { type: FlowType.PaymentFlowHold, onHoldExpiration: c.holdExpiration };
    return c.paymentFlowHold ? hold : instant;
};

const getSessionInfo = (redirectUrl: string) => ({
    sessionInfo: {
        redirectUrl
    }
});

export function* createPayment(
    endpoint: string,
    token: string,
    invoiceID: string,
    formValue: PayableFormValues,
    resource: PaymentResource,
    initConfig: InitConfig,
    redirectUrl?: string
): Iterator<Effects> {
    const { paymentToolToken, paymentSession } = resource;
    const params = {
        flow: toPaymentFlow(initConfig),
        payer: {
            payerType: PayerType.PaymentResourcePayer,
            paymentToolToken,
            paymentSession,
            contactInfo: {
                email: initConfig.email || formValue.email,
                phoneNumber: initConfig.phoneNumber || replaceSpaces(formValue.phoneNumber)
            },
            ...(redirectUrl && getSessionInfo(redirectUrl))
        },
        makeRecurrent: initConfig.recurring,
        metadata: initConfig.metadata
    };
    return yield call(request, endpoint, token, invoiceID, params);
}
