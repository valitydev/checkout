import { call } from 'redux-saga/effects';

export function* createYaPayment(paymentData: YaPay.PaymentData) {
    try {
        return yield call(YaPay.createPayment, paymentData);
    } catch (error) {
        throw { code: 'error.yandex.pay.unavailable' };
    }
}
