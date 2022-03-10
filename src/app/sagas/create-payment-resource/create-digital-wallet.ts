import { call, CallEffect } from 'redux-saga/effects';
import * as md5 from 'md5';

import {
    KnownDigitalWalletProviders,
    SticpayWalletFormValues,
    VenusPointWalletFormValues,
    WalletFormValues
} from 'checkout/state';
import { PaymentResource, PaymentToolType, createPaymentResource } from 'checkout/backend';
import { replaceSpaces } from './replace-spaces';
import { assertUnreachable } from 'checkout/utils';

const getPaymentToolDetails = (formValues: WalletFormValues): { id: string; token?: string } => {
    switch (formValues.provider) {
        case KnownDigitalWalletProviders.Sticpay:
            return {
                id: replaceSpaces((formValues as SticpayWalletFormValues).sticpayAccount)
            };
        case KnownDigitalWalletProviders.Venuspoint:
            const venusPointFormValues = formValues as VenusPointWalletFormValues;
            return {
                id: replaceSpaces(venusPointFormValues.venusPointAccount),
                token: md5(replaceSpaces(venusPointFormValues.venusPointPassword))
            };
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
        ...getPaymentToolDetails(formValues)
    };
    return yield call(createPaymentResource, endpoint, token, paymentTool);
}
