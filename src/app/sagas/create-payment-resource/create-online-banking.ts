import { call, CallEffect } from 'redux-saga/effects';
import { createPaymentResource, PaymentResource, PaymentToolType } from 'checkout/backend';
import { OnlineBankingPaymentResourceMetadata } from 'checkout/backend/model/online-banking/online-banking-payment-resource-metadata';

export function* createOnlineBanking(
    endpoint: string,
    token: string,
    provider: string,
    metadata: OnlineBankingPaymentResourceMetadata
): Iterator<CallEffect | PaymentResource> {
    const paymentTool = {
        paymentToolType: PaymentToolType.PaymentTerminalData,
        provider,
        metadata
    };
    return yield call(createPaymentResource, endpoint, token, paymentTool);
}
