import { call, CallEffect } from 'redux-saga/effects';
import { createPaymentResource, PaymentResource, PaymentToolType, PaymentTool } from 'checkout/backend';

export function* createOnlineBanking(endpoint: string, token: string): Iterator<CallEffect | PaymentResource> {
    const paymentTool = {
        paymentToolType: PaymentToolType.PaymentTerminalData // TODO
    } as PaymentTool;
    return yield call(createPaymentResource, endpoint, token, paymentTool);
}
