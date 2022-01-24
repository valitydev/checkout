import { payWithGooglePay, createPaymentResource } from './pay-with-google-pay';
import { makePayment } from '../make-payment';
import { call } from 'redux-saga/effects';
import { getPaymentData } from './get-payment-data';
import { AppConfig } from 'checkout/backend';

describe('payWithGooglePay', () => {
    const endpoint = 'http://test.endpoint';
    const locale = 'localeMock' as any;
    const googlePayConfig: AppConfig['googlePay'] = {
        merchantName: 'merchantName',
        merchantID: 'googlePayMerchantIDMock',
        gatewayMerchantID: 'googlePayGatewayMerchantIDMock',
        gateway: 'gateway',
        merchantOrigin: 'merchantOrigin'
    };
    const appConfig = {
        capiEndpoint: endpoint,
        googlePay: googlePayConfig
    } as any;
    const c = { appConfig, initConfig: { locale } } as any;
    const m = 'ModelStateMock' as any;
    const a = 'AmountInfoStateMock' as any;
    const v = { amount: 'PayableFormValuesMock' } as any;
    const iterator = payWithGooglePay(c, m, a, v);

    it('should call getPaymentData', () => {
        const actual = iterator.next().value;
        const expected = call(getPaymentData, googlePayConfig, a, v.amount);
        expect(actual).toEqual(expected);
    });

    it('should call makePayment', () => {
        const paymentData = 'paymentDataMock' as any;
        const fn = createPaymentResource(c.appConfig.capiEndpoint, googlePayConfig.merchantID, paymentData);
        const actual = iterator.next(paymentData).value;
        const expected = call(makePayment, c, m, v, a, fn);
        expect(actual.toString()).toEqual(expected.toString());
    });
});
