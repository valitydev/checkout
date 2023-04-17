import { call, CallEffect, SelectEffect } from 'redux-saga/effects';

import { AmountInfoState, ModelState, TokenProviderFormValues } from 'checkout/state';
import { Config } from 'checkout/config';
import { getYaPayPaymentData } from 'checkout/utils/get-ya-pay-payment-data';

import { createYandexPay } from '../../../create-payment-resource';
import { makePayment } from '../make-payment';
import { processYaCheckout } from './process-ya-checkout';
import { completeYaPayment } from './complete-ya-payment';
import { createYaPayment } from './create-ya-payment';
import { getYaPaymentOrder } from './get-ya-payment-order';

const createPaymentResource = (endpoint: string, merchantID: string, paymentToken: object) =>
    createYandexPay.bind(null, endpoint, merchantID, paymentToken);

export function* payWithYandexPay(
    c: Config,
    m: ModelState,
    a: AmountInfoState,
    v: TokenProviderFormValues
): Iterator<SelectEffect | CallEffect> {
    const {
        appConfig: { yandexPay, capiEndpoint }
    } = c;
    const yaOrder = getYaPaymentOrder(a, v.amount);
    const yaPaymentData = getYaPayPaymentData(
        yandexPay.merchantID,
        yandexPay.merchantName,
        yandexPay.gatewayMerchantID,
        yaOrder
    );
    const yaPayment: YaPay.Payment = yield call(createYaPayment, yaPaymentData);
    const yaProcessEvent = yield call(processYaCheckout, yaPayment);
    try {
        const fn = createPaymentResource(capiEndpoint, yandexPay.gatewayMerchantID, yaProcessEvent);
        yield call(makePayment, c, m, v, a, fn);
    } catch (error) {
        yaPayment.complete(YaPay.CompleteReason.Error, null);
        throw error;
    }
    yield call(completeYaPayment, yaPayment);
}
