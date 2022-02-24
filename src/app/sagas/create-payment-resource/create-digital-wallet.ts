import { call, CallEffect } from 'redux-saga/effects';
import { KnownDigitalWalletProviders, SticpayWalletFormValues, WalletFormValues } from 'checkout/state';
import { PaymentResource, PaymentToolType, createPaymentResource } from 'checkout/backend';
import { replaceSpaces } from './replace-spaces';
import { assertUnreachable } from 'checkout/utils';

const getID = (formValues: WalletFormValues): string => {
    switch (formValues.provider) {
        case KnownDigitalWalletProviders.Sticpay:
            return (formValues as SticpayWalletFormValues).sticpayAccount;
        default:
            assertUnreachable(formValues.provider);
    }
};

export function* createDigitalWallet(
    endpoint: string,
    formValues: WalletFormValues,
    token: string
): Iterator<CallEffect | PaymentResource> {
    const paymentTool = {
        paymentToolType: PaymentToolType.DigitalWalletData,
        provider: formValues.provider,
        id: replaceSpaces(getID(formValues))
    };
    return yield call(createPaymentResource, endpoint, token, paymentTool);
}
