import { call, CallEffect } from 'redux-saga/effects';
import { createPaymentResource, PaymentResource, PaymentToolType } from 'checkout/backend';

export function* createOnlineBanking(
    endpoint: string,
    metadata: any,
    token: string
): Iterator<CallEffect | PaymentResource> {
    const paymentTool = {
        paymentToolType: PaymentToolType.PaymentTerminalData,
        provider: 'onlinebanking',
        metadata
    };
    return yield call(createPaymentResource, endpoint, token, paymentTool);
}
