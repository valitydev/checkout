import { call, CallEffect } from 'redux-saga/effects';

import { WalletFormValues } from 'checkout/state';
import { PaymentResource, PaymentToolType, createPaymentResource } from 'checkout/backend';

export function* createDigitalWallet(
    endpoint: string,
    formValues: WalletFormValues,
    token: string
): Iterator<CallEffect | PaymentResource> {
    const paymentTool = {
        paymentToolType: PaymentToolType.DigitalWalletData,
        ...formValues
    };
    return yield call(createPaymentResource, endpoint, token, paymentTool);
}
