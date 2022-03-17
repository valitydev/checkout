import { call, CallEffect } from 'redux-saga/effects';
import { createPaymentResource, PaymentResource, PaymentToolType } from 'checkout/backend';

export function* createPaymentTerminal(
    endpoint: string,
    provider: string,
    metadata: any,
    token: string
): Iterator<CallEffect | PaymentResource> {
    const paymentTool = {
        paymentToolType: PaymentToolType.PaymentTerminalData,
        provider,
        metadata
    };
    return yield call(createPaymentResource, endpoint, token, paymentTool);
}
